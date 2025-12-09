
import { Event } from './types';

export const MOCK_EVENTS: Event[] = [
  {
    id: 1,
    name: "Festa de Ano Novo",
    date: "31/12",
    time: "22h",
    location: "Centro de Eventos",
    participants: [
      { id: 101, name: "João Silva", cpf: "123.456.789-00", email: "joao@email.com", ticketType: "VIP", price: 150.00, checkedIn: true, checkInTime: "22:35", checkedInBy: "Maria" },
      { id: 102, name: "Maria Santos", cpf: "987.654.321-00", email: "maria@email.com", ticketType: "Pista", price: 80.00, checkedIn: true, checkInTime: "22:34", checkedInBy: "João" },
      { id: 103, name: "Pedro Costa", cpf: "111.222.333-44", email: "pedro@email.com", ticketType: "Pista", price: 80.00, checkedIn: true, checkInTime: "22:33", checkedInBy: "João" },
      { id: 104, name: "Ana Lima", cpf: "444.555.666-77", email: "ana@email.com", ticketType: "VIP", price: 150.00, checkedIn: true, checkInTime: "22:32", checkedInBy: "Maria" },
      { id: 105, name: "Carlos Souza", cpf: "777.888.999-00", email: "carlos@email.com", ticketType: "Camarote", price: 250.00, checkedIn: true, checkInTime: "22:31", checkedInBy: "Operador" },
      { id: 106, name: "Beatriz Ferraz", cpf: "121.212.121-21", email: "beatriz@email.com", ticketType: "Pista", price: 80.00, checkedIn: false },
      { id: 107, name: "Daniel Alves", cpf: "343.434.343-43", email: "daniel@email.com", ticketType: "VIP", price: 150.00, checkedIn: false },
      { id: 108, name: "Eduarda Rocha", cpf: "565.656.565-65", email: "eduarda@email.com", ticketType: "Camarote", price: 250.00, checkedIn: false },
    ],
  },
  {
    id: 2,
    name: "Show de Rock",
    date: "15/01",
    time: "20h",
    location: "Arena Central",
    participants: [
       { id: 201, name: "Fernanda Oliveira", cpf: "234.567.890-11", email: "fernanda@email.com", ticketType: "Pista Premium", price: 120.00, checkedIn: true, checkInTime: "20:15", checkedInBy: "João" },
       { id: 202, name: "Ricardo Almeida", cpf: "345.678.901-22", email: "ricardo@email.com", ticketType: "Pista", price: 70.00, checkedIn: false },
       { id: 203, name: "Gabriel Martins", cpf: "456.789.012-33", email: "gabriel@email.com", ticketType: "Pista Premium", price: 120.00, checkedIn: false },
       { id: 204, name: "Helena Costa", cpf: "567.890.123-44", email: "helena@email.com", ticketType: "Arquibancada", price: 50.00, checkedIn: true, checkInTime: "19:55", checkedInBy: "Maria" },
       { id: 205, name: "Igor Barbosa", cpf: "678.901.234-55", email: "igor@email.com", ticketType: "Pista", price: 70.00, checkedIn: false },
    ],
  },
   {
    id: 3,
    name: "Festival de Jazz",
    date: "22/02",
    time: "18h",
    location: "Parque da Cidade",
    participants: [
       { id: 301, name: "Juliana Pereira", cpf: "456.789.012-33", email: "juliana@email.com", ticketType: "Passaporte", price: 200.00, checkedIn: false },
       { id: 302, name: "Lucas Gonçalves", cpf: "789.012.345-66", email: "lucas@email.com", ticketType: "Passaporte", price: 200.00, checkedIn: true, checkInTime: "18:30", checkedInBy: "João" },
       { id: 303, name: "Manuela Dias", cpf: "890.123.456-77", email: "manuela@email.com", ticketType: "Diário", price: 90.00, checkedIn: false },
       { id: 304, name: "Nicolas Teixeira", cpf: "901.234.567-88", email: "nicolas@email.com", ticketType: "Diário", price: 90.00, checkedIn: false },
    ],
  },
  {
    id: 4,
    name: "Conferência de Tecnologia",
    date: "10/03",
    time: "09h",
    location: "Expo Center",
    participants: [
      { id: 401, name: "Otávio Mendes", cpf: "112.233.445-56", email: "otavio@email.com", ticketType: "Developer Pass", price: 350.00, checkedIn: false },
      { id: 402, name: "Patrícia Nogueira", cpf: "223.344.556-67", email: "patricia@email.com", ticketType: "Student Pass", price: 150.00, checkedIn: true, checkInTime: "09:05", checkedInBy: "Maria" },
      { id: 403, name: "Quintino Ribeiro", cpf: "334.455.667-78", email: "quintino@email.com", ticketType: "Business Pass", price: 500.00, checkedIn: false },
      { id: 404, name: "Renata Aragão", cpf: "445.566.778-89", email: "renata@email.com", ticketType: "Developer Pass", price: 350.00, checkedIn: false },
      { id: 405, name: "Samuel Farias", cpf: "556.677.889-90", email: "samuel@email.com", ticketType: "Student Pass", price: 150.00, checkedIn: false },
      { id: 406, name: "Tatiana Moreira", cpf: "667.788.990-01", email: "tatiana@email.com", ticketType: "Business Pass", price: 500.00, checkedIn: true, checkInTime: "09:20", checkedInBy: "João" },
    ],
  },
  {
    id: 5,
    name: "Feira Gastronômica",
    date: "05/04",
    time: "12h",
    location: "Mercado Municipal",
    participants: [
      { id: 501, name: "Ulisses Peixoto", cpf: "778.899.001-12", email: "ulisses@email.com", ticketType: "Entrada", price: 20.00, checkedIn: false },
      { id: 502, name: "Valentina Matos", cpf: "889.900.112-23", email: "valentina@email.com", ticketType: "Entrada", price: 20.00, checkedIn: false },
      { id: 503, name: "Wagner Carvalho", cpf: "990.011.223-34", email: "wagner@email.com", ticketType: "Entrada", price: 20.00, checkedIn: true, checkInTime: "12:01", checkedInBy: "João" },
      { id: 504, name: "Xuxa Meneghel", cpf: "001.122.334-45", email: "xuxa@email.com", ticketType: "Entrada", price: 20.00, checkedIn: false },
      { id: 505, name: "Yasmin Brunet", cpf: "112.233.445-56", email: "yasmin@email.com", ticketType: "Entrada", price: 20.00, checkedIn: true, checkInTime: "13:40", checkedInBy: "Maria" },
      { id: 506, name: "Zeca Pagodinho", cpf: "223.344.556-67", email: "zeca@email.com", ticketType: "Entrada", price: 20.00, checkedIn: false },
    ],
  },
];
