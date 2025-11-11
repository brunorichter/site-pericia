# verifica-projeto.ps1
# Execute na raiz do projeto com: powershell -ExecutionPolicy Bypass -File .\verifica-projeto.ps1
$ErrorActionPreference = "Stop"

function Write-Section($title) { Write-Host "`n==== $title ====" -ForegroundColor Cyan }
function Try-GetCommand($name) { try { Get-Command $name -ErrorAction Stop | Out-Null; $true } catch { $false } }

Write-Section "Verificacao do repositorio"
try { $inside = git rev-parse --is-inside-work-tree 2>$null } catch { $inside = $null }
if ($inside -ne "true") { Write-Host "Não e um repositorio Git. Saindo." -ForegroundColor Red; exit 1 }

$root = git rev-parse --show-toplevel
Set-Location $root
Write-Host "Raiz do repo: $root"

Write-Section "Status Git e sincronizacao"
$branch = (git rev-parse --abbrev-ref HEAD).Trim()
$branchState = if ($branch -eq "HEAD") { "DETACHED" } else { $branch }

Write-Host "Branch atual: $branchState"

$upstream = $null
try {
  # IMPORTANTE: "@{u}" entre aspas para o PowerShell não interpretar como hashtable
  $upstream = (git rev-parse --abbrev-ref --symbolic-full-name "@{u}").Trim()
  Write-Host "Upstream: $upstream"
} catch {
  Write-Host "Sem upstream configurado para '$branchState'. Recomendo: git branch --set-upstream-to origin/$branchState" -ForegroundColor Yellow
}

try { git fetch --all --prune | Out-Null; Write-Host "Fetch remoto concluido." } catch { Write-Host "Falha no git fetch: $($_.Exception.Message)" -ForegroundColor Yellow }

$changed = git status --porcelain=v1 | Where-Object { $_ -notmatch '^\?\?' } | Measure-Object | Select-Object -ExpandProperty Count
if (-not $changed) { $changed = 0 }
$untracked = (git ls-files --others --exclude-standard | Measure-Object).Count

$ahead = 0; $behind = 0
if ($upstream) {
  try {
    $lr = (git rev-list --left-right --count HEAD..."$upstream").Trim().Split(" ")
    if ($lr.Length -eq 2) { $behind = [int]$lr[0]; $ahead = [int]$lr[1] }
  } catch { Write-Host "Falha ao calcular ahead/behind: $($_.Exception.Message)" -ForegroundColor Yellow }
}

$diffWithUpstream = 0
if ($upstream) {
  try { $diffWithUpstream = (git diff --name-only HEAD "$upstream" | Measure-Object).Count } catch { $diffWithUpstream = 0 }
}

Write-Section "Dependencias"
$pkgManager = "npm"
$pkgInstalled = $false
$depLogs = @()

$hasPkgJson   = Test-Path -Path (Join-Path $root "package.json")
$hasNodeMods  = Test-Path -Path (Join-Path $root "node_modules")
$hasPnpmLock  = Test-Path -Path (Join-Path $root "pnpm-lock.yaml")
$hasYarnLock  = Test-Path -Path (Join-Path $root "yarn.lock")
$hasNpmLock   = Test-Path -Path (Join-Path $root "package-lock.json")

if ($hasPkgJson) {
  if ($hasPnpmLock -and (Try-GetCommand "pnpm")) { $pkgManager = "pnpm" }
  elseif ($hasYarnLock -and (Try-GetCommand "yarn")) { $pkgManager = "yarn" }
  elseif (Try-GetCommand "npm") { $pkgManager = "npm" }

  if (-not $pkgManager) {
    $depLogs += "Nenhum gerenciador Node encontrado. Instale pnpm, yarn ou npm."
  } else {
    try {
      switch ($pkgManager) {
        "pnpm" {
          $depLogs += "Executando pnpm install --frozen-lockfile"
          pnpm install --frozen-lockfile | Out-Null
          $pkgInstalled = $true
        }
        "yarn" {
          $depLogs += "Executando yarn install --frozen-lockfile"
          yarn install --frozen-lockfile | Out-Null
          $pkgInstalled = $true
        }
        "npm" {
          if ($hasNpmLock -and -not $hasNodeMods) {
            $depLogs += "Executando npm ci"
            npm ci | Out-Null
          } else {
            $depLogs += "Executando npm install"
            npm install | Out-Null
          }
          $pkgInstalled = $true
        }
      }
    } catch {
      # Use ${var} antes de ":" para evitar parsing incorreto
      $depLogs += "Falha ao instalar dependencias Node com ${pkgManager}: $($_.Exception.Message)"
    }
  }
} else {
  $depLogs += "package.json nao encontrado. Pulando checagem Node."
}

$hasReq = Test-Path -Path (Join-Path $root "requirements.txt")
if ($hasReq) {
  if (Try-GetCommand "pip") {
    try { $depLogs += "Instalando dependencias Python: pip install -r requirements.txt"; pip install -r requirements.txt | Out-Null }
    catch { $depLogs += "Falha ao instalar dependencias Python (pip): $($_.Exception.Message)" }
  } elseif (Try-GetCommand "py") {
    try { $depLogs += "Instalando dependencias Python: py -m pip install -r requirements.txt"; py -m pip install -r requirements.txt | Out-Null }
    catch { $depLogs += "Falha ao instalar dependencias Python (py -m pip): $($_.Exception.Message)" }
  } else {
    $depLogs += "Python/pip nao encontrado para requirements.txt"
  }
}

Write-Section "Relatorio"
$inSync = if ($upstream) { ($ahead -eq 0 -and $behind -eq 0 -and $changed -eq 0 -and $untracked -eq 0 -and $diffWithUpstream -eq 0) } else { ($changed -eq 0 -and $untracked -eq 0) }

$report = [PSCustomObject]@{
  RepoRoot               = $root
  Branch                 = $branchState
  Upstream               = $(if ($upstream) { $upstream } else { "nao configurado" })
  Ahead                  = $ahead
  Behind                 = $behind
  AlteracoesLocais       = $changed
  Untracked              = $untracked
  DiffComUpstream        = $diffWithUpstream
  EmSincronia            = $(if ($inSync) { "Sim" } else { "Nao" })
  GerenciadorPacotes     = $(if ($pkgManager) { $pkgManager } else { "nao detectado" })
  DependenciasProcessadas= $(if ($pkgInstalled) { "Sim" } else { "Parcial/Nao" })
}

$report | Format-List

if ($depLogs.Count -gt 0) {
  Write-Section "Log de dependencias"
  $depLogs | ForEach-Object { Write-Host $_ }
}

if ($inSync) { Write-Host "`nProjeto em sincronia." -ForegroundColor Green; exit 0 }
else { Write-Host "`nProjeto fora de sincronia ou com alteracoes locais." -ForegroundColor Yellow; exit 2 }
