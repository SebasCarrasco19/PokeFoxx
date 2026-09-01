const TCG_STORAGE = {
  products: 'tcgmarket_products_v1',
  users: 'tcgmarket_users_v1',
  cart: 'tcgmarket_cart_v1',
  session: 'tcgmarket_session_v1',
  orders: 'tcgmarket_orders_v1',
  contacts: 'tcgmarket_contacts_v1',
  comments: 'tcgmarket_comments_v1'
};

const TCG_CATEGORIES = [
  'Cartas individuales',
  'Sobres sellados',
  'Mazos',
  'Accesorios'
];

// Juegos TCG usados para filtrar el catálogo público.
const TCG_GAMES = [
  'Pokémon',
  'One Piece',
  'Dragon Ball'
];

const TCG_SEED_PRODUCTS = [
  { id: 1, code: 'TCG001', name: 'Fénix Arcano', description: 'Carta coleccionable individual para ampliar una colección TCG.', price: 7990, originalPrice: 9990, onSale: true, game: 'Pokémon', stock: 8, criticalStock: 2, category: 'Cartas individuales', image: 'assets/img/producto-fenix.svg' },
  { id: 2, code: 'TCG002', name: 'Dragón Eclipse', description: 'Carta individual de colección con acabado ilustrado.', price: 12990, originalPrice: 12990, onSale: false, game: 'Dragon Ball', stock: 5, criticalStock: 2, category: 'Cartas individuales', image: 'assets/img/producto-dragon.svg' },
  { id: 3, code: 'TCG003', name: 'Mago Prisma', description: 'Carta individual pensada para coleccionistas y jugadores.', price: 5990, originalPrice: 7990, onSale: true, game: 'One Piece', stock: 10, criticalStock: 3, category: 'Cartas individuales', image: 'assets/img/Luffy.webp' },
  { id: 4, code: 'TCG004', name: 'Booster Nebula', description: 'Sobre sellado con cartas aleatorias para ampliar tu colección.', price: 4990, originalPrice: 4990, onSale: false, game: 'Pokémon', stock: 24, criticalStock: 5, category: 'Sobres sellados', image: 'assets/img/producto-booster.svg' },
  { id: 5, code: 'TCG005', name: 'Starter Deck', description: 'Mazo inicial preparado para comenzar a jugar.', price: 18990, originalPrice: 21990, onSale: true, game: 'One Piece', stock: 6, criticalStock: 2, category: 'Mazos', image: 'assets/img/producto-deck.svg' },
  { id: 6, code: 'TCG006', name: 'Protectores Pro', description: 'Pack de protectores para mantener las cartas en buen estado.', price: 6990, originalPrice: 6990, onSale: false, game: 'Dragon Ball', stock: 30, criticalStock: 5, category: 'Accesorios', image: 'assets/img/producto-sleeves.svg' }
];

// El Anexo 1 indica que regiones y comunas deben provenir de un arreglo JavaScript complementario.
// Ese arreglo no fue incluido entre los anexos recibidos. Se incluye este arreglo demostrativo para
// implementar y probar la dependencia Región -> Comuna. Puede reemplazarse por el arreglo oficial.
const TCG_REGIONS = [
  { region: 'Región Metropolitana', communes: ['Santiago', 'Providencia', 'Maipú'] },
  { region: 'Región de Valparaíso', communes: ['Valparaíso', 'Viña del Mar', 'Quilpué'] },
  { region: 'Región del Biobío', communes: ['Concepción', 'Talcahuano', 'Los Ángeles'] },
  { region: 'Región de La Araucanía', communes: ['Temuco', 'Padre Las Casas', 'Villarrica'] }
];

const TCG_SEED_USERS = [
  { run: '190110222', firstName: 'Administrador', lastName: 'TCG Market', email: 'admin@duoc.cl', birthDate: '', role: 'Administrador', region: 'Región Metropolitana', commune: 'Santiago', address: 'Dirección demostrativa 100', password: 'Admin123' },
  { run: '111111111', firstName: 'Vendedor', lastName: 'TCG Market', email: 'vendedor@gmail.com', birthDate: '', role: 'Vendedor', region: 'Región Metropolitana', commune: 'Santiago', address: 'Dirección demostrativa 200', password: 'Vend1234' },
  { run: '222222222', firstName: 'Cliente', lastName: 'Demo', email: 'cliente@gmail.com', birthDate: '', role: 'Cliente', region: 'Región Metropolitana', commune: 'Santiago', address: 'Dirección demostrativa 300', password: 'Clie123' }
];

const TCG_SEED_ORDERS = [
  { id: 'ORD-001', customer: 'Cliente Demo', date: '2026-08-20', total: 17970, status: 'Pendiente', items: [{ productId: 1, name: 'Fénix Arcano', qty: 1, price: 7990 }, { productId: 4, name: 'Booster Nebula', qty: 2, price: 4990 }] },
  { id: 'ORD-002', customer: 'Cliente Demo', date: '2026-08-21', total: 18990, status: 'Preparando', items: [{ productId: 5, name: 'Starter Deck', qty: 1, price: 18990 }] }
];
