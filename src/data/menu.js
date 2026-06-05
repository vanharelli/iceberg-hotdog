export const menuData = [
  {
    category: "DOG NO MOLHO",
    items: [
      {
        id: "molho-simples",
        name: "Cachorro Quente no Molho",
        description: "2 salsichas, queijo, pasta de alho, milho e batata palha.",
        price: "R$ 18,00",
        img: "/dog-no-molho.png",
        isSpecial: false,
        type: "food"
      },
      {
        id: "molho-bacon",
        name: "Cachorro Quente no Molho c/ Bacon",
        description: "2 salsichas, queijo, pasta de alho, milho, bacon, cheddar e batata palha.",
        price: "R$ 21,00",
        img: "/dog-no-molho-com-bacon.png",
        isSpecial: false,
        type: "food"
      },
      {
        id: "molho-frango",
        name: "Cachorro Quente no Molho de Frango",
        description: "Filé de frango, queijo, pasta de alho, milho e batata palha.",
        price: "R$ 23,00",
        img: "/dogdegrangonomolho.jpg",
        isSpecial: false,
        type: "food"
      },
      {
        id: "molho-strogonoff",
        name: "Cachorro Quente de Strogonoff",
        description: "Frango, queijo, pasta de alho, milho e batata palha.",
        price: "R$ 25,00",
        img: "/dogdeestrogonoff.png",
        isSpecial: false,
        type: "food"
      }
    ]
  },
  {
    category: "DOG NA CHAPA",
    items: [
      {
        id: "chapa-bacon",
        name: "Cachorro Quente na Chapa c/ Bacon",
        description: "2 salsichas, queijo, pasta de alho, milho, bacon, cheddar e batata palha.",
        price: "R$ 23,00",
        img: "/dog-na-chapa.png",
        isSpecial: false,
        type: "food"
      },
      {
        id: "chapa-vegetariano",
        name: "Cachorro Quente Vegetariano",
        description: "2 ovos, queijo, pasta de alho, cheddar, milho e batata palha.",
        price: "R$ 18,00",
        img: "/x-vegetariano.png",
        isSpecial: false,
        type: "food"
      }
    ]
  },
  {
    category: "ICEBERG",
    items: [
      {
        id: "iceberg-frango-salsicha",
        name: "Cachorro Quente de Frango c/ Salsicha",
        description: "Filé de frango, queijo, salsicha, cheddar, pasta de alho, milho, batata palha e bacon.",
        price: "R$ 38,00",
        img: "/iceberg-com-salsicha.png",
        isSpecial: false,
        type: "food"
      },
      {
        id: "iceberg-carro-chefe",
        name: "Iceberg (Carro Chefe da Casa)",
        description: "Filé de frango, queijo, cheddar, pasta de alho, milho, batata palha e bacon.",
        price: "R$ 33,00",
        img: "/iceberg.png",
        isSpecial: true,
        type: "food"
      }
    ]
  },
  {
    category: "HAMBÚRGUER / X-TUDO",
    items: [
      {
        id: "burg-xburg",
        name: "X-Burguer",
        description: "Pão, hambúrguer picanha artesanal, queijo, presunto e abacaxi.",
        price: "R$ 23,00",
        img: "/x-burger.png",
        isSpecial: false,
        type: "food"
      },
      {
        id: "burg-xsalada",
        name: "X-Salada",
        description: "Pão, hambúrguer picanha artesanal, queijo, presunto, alface, tomate e abacaxi.",
        price: "R$ 25,00",
        img: "/xsalada.png",
        isSpecial: false,
        type: "food"
      },
      {
        id: "burg-xbacon",
        name: "X-Bacon",
        description: "Pão, hambúrguer picanha artesanal, queijo, presunto, bacon, alface, tomate e abacaxi.",
        price: "R$ 29,00",
        img: "/x-bacon.png",
        isSpecial: false,
        type: "food"
      },

      {
        id: "burg-xfrango",
        name: "X-Frango",
        description: "Pão, hambúrguer artesanal de frango, filé de frango, queijo, presunto, abacaxi, tomate, alface, bacon e pasta de alho.",
        price: "R$ 30,00",
        img: "/x-frango.png",
        isSpecial: false,
        type: "food"
      },
      {
        id: "burg-vegetariano",
        name: "Hambúrguer Vegetariano",
        description: "2 ovos, queijo, milho, alface, pasta de alho, abacaxi e batata palha.",
        price: "R$ 18,00",
        img: "/x-vegetariano.png",
        isSpecial: false,
        type: "food"
      },
      {
        id: "burg-xtudo",
        name: "X-Tudo",
        description: "Pão, hambúrguer picanha artesanal, salsicha, queijo, presunto, bacon, ovo caipira, alface, tomate e abacaxi.",
        price: "R$ 33,00",
        img: "/xtudo.png",
        isSpecial: false,
        type: "food"
      },
      {
        id: "burg-xtudo-duplo",
        name: "X-Tudo Duplo",
        description: "Pão, hambúrguer picanha artesanal, 2 salsichas, queijo, presunto, bacon, 2 ovos caipira, alface, 2 tomates, abacaxi, milho e batata palha.",
        price: "R$ 37,00",
        img: "/x-tudo-duplo.png",
        isSpecial: true,
        type: "food"
      }
    ]
  },
  {
    category: "BEBIDAS E SUCOS NATURAIS",
    items: [
      {
        id: "bebidas-naturais",
        name: "Bebidas e Sucos Naturais",
        description: "Sucos naturais, vitaminas e águas.",
        price: "",
        img: "/bebidas.png",
        isSpecial: false,
        type: "beverage_collection",
        beverages: [
          { id: "nat-suco-laranja", name: "Suco Natural (Laranja)", price: 12.00 },
          { id: "nat-suco-limao", name: "Suco Natural (Limão)", price: 12.00 },
          { id: "nat-suco-abacaxi", name: "Suco Natural (Abacaxi)", price: 12.00 },
          { id: "nat-vit-mamao", name: "Vitamina (Mamão)", price: 12.00 },
          { id: "nat-vit-banana", name: "Vitamina (Banana)", price: 12.00 },
          { id: "nat-vit-abacate", name: "Vitamina (Abacate)", price: 12.00 },
          { id: "nat-agua-sg", name: "Água (Sem Gás)", price: 4.00 },
          { id: "nat-agua-cg", name: "Água (Com Gás)", price: 4.00 },
          { id: "nat-agua-coco", name: "Água de Coco Verde", price: 10.00 }
        ]
      }
    ]
  }
];
