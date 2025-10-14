import React, { useState } from 'react';
import { MailIcon, PhoneIcon } from '../components/Icons';

const Contact = (): JSX.Element => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('Obrigado! Sua mensagem foi enviada com sucesso.');
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setStatus(''), 5000);
  };

  return (
    <section id="contato" className="py-20 bg-brand-dark">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Fale Conosco</h2>
          <div className="w-24 h-1 bg-brand-cyan-500 mx-auto"></div>
          <p className="text-brand-gray mt-4 max-w-2xl mx-auto">
            Precisa de um perito ou assistente técnico? Entre em contato para um orçamento ou para esclarecer suas dúvidas.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-brand-gray mb-2 uppercase tracking-wider">Nome</label>
                <input 
                  type="text" 
                  name="name" 
                  id="name" 
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-brand-dark-secondary border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-brand-cyan-500 focus:border-brand-cyan-500 transition text-sm"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-brand-gray mb-2 uppercase tracking-wider">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  id="email" 
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-brand-dark-secondary border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-brand-cyan-500 focus:border-brand-cyan-500 transition text-sm"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-xs font-medium text-brand-gray mb-2 uppercase tracking-wider">Mensagem</label>
                <textarea 
                  name="message" 
                  id="message" 
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full bg-brand-dark-secondary border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-brand-cyan-500 focus:border-brand-cyan-500 transition text-sm"
                ></textarea>
              </div>
              <div>
                <button type="submit" className="w-full bg-brand-cyan-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-brand-cyan-600 transition duration-300 shadow-md">
                  Enviar Mensagem
                </button>
              </div>
              {status && <p className="text-center text-brand-cyan-400 mt-4">{status}</p>}
            </form>
          </div>
          <div className="md:w-1/2 flex flex-col justify-center space-y-6">
              <div className="flex items-start p-6 bg-brand-dark-secondary rounded-lg">
                <div className="text-brand-cyan-400 mt-1 mr-4"><MailIcon /></div>
                <div>
                  <h3 className="text-xl font-bold text-white">Email</h3>
                  <p className="text-brand-gray">bruno@richter.eng.br</p>
                </div>
            </div>
            <div className="flex items-start p-6 bg-brand-dark-secondary rounded-lg">
                <div className="text-brand-cyan-400 mt-1 mr-4"><PhoneIcon /></div>
                <div>
                  <h3 className="text-xl font-bold text-white">Telefone / WhatsApp</h3>
                  <p className="text-brand-gray">(51) 99633-8120</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;