export type Locale = "en" | "pt";

export const translations = {
  en: {
    // Hero
    heroTagline: "Life Creation Studio",
    heroCta: "Get in Touch",
    heroScroll: "Scroll",

    // Marquee
    marqueeEvents: "Events",
    marqueeWeddings: "Weddings",
    marqueePeople: "People",
    marqueeBrands: "Brands",

    // Story
    storyLine1: "Every moment has a story",
    storyLine2: "Let me help you tell yours",
    storyLine3: "Let\u2019s build your story\u2009\u2014\u2009together",

    // Services
    serviceEvents: "Events",
    serviceWeddings: "Weddings",
    servicePeople: "People",
    serviceBrands: "Brands",

    // Form section
    formSectionLabel: "Get in touch",
    formSectionTitle: "Drop your enquiry below",

    // Form fields
    formFirstName: "First Name",
    formLastName: "Last Name",
    formEmail: "Email",
    formServices: "How can I help?",
    formMessage: "Tell me about your project",
    formFirstNamePlaceholder: "Your first name",
    formLastNamePlaceholder: "Your last name",
    formEmailPlaceholder: "your@email.com",
    formMessagePlaceholder: "Share the details of your enquiry...",
    formSubmit: "Submit",
    formSending: "Sending",

    // Form validation
    errorFirstName: "First name is required",
    errorLastName: "Last name is required",
    errorEmail: "Email is required",
    errorEmailInvalid: "Please enter a valid email",
    errorServices: "Please select at least one service",
    errorMessage: "Please share some details",
    errorGeneric: "Something went wrong. Please try again.",

    // Form success
    successTitle: "Thank you",
    successMessage: "We\u2019ll be in touch soon.",
    successAnother: "Send another enquiry",

    // Footer
    footerRights: "All rights reserved.",

    // Language toggle
    langToggle: "PT",
  },
  pt: {
    // Hero
    heroTagline: "Life Creation Studio",
    heroCta: "Contacta-nos",
    heroScroll: "Arrasta",

    // Marquee
    marqueeEvents: "Eventos",
    marqueeWeddings: "Casamentos",
    marqueePeople: "Pessoas",
    marqueeBrands: "Marcas",

    // Story
    storyLine1: "Cada momento tem uma história",
    storyLine2: "Deixa-me ajudar-te a contar a tua",
    storyLine3: "Vamos construir a tua história\u2009\u2014\u2009juntos",

    // Services
    serviceEvents: "Eventos",
    serviceWeddings: "Casamentos",
    servicePeople: "Pessoas",
    serviceBrands: "Marcas",

    // Form section
    formSectionLabel: "Contacta-nos",
    formSectionTitle: "Envia o teu pedido abaixo",

    // Form fields
    formFirstName: "Primeiro Nome",
    formLastName: "Apelido",
    formEmail: "Email",
    formServices: "Como posso ajudar?",
    formMessage: "Fala-me sobre o teu projeto",
    formFirstNamePlaceholder: "O teu primeiro nome",
    formLastNamePlaceholder: "O teu apelido",
    formEmailPlaceholder: "o-teu@email.com",
    formMessagePlaceholder: "Partilha os detalhes do teu pedido...",
    formSubmit: "Enviar",
    formSending: "A enviar",

    // Form validation
    errorFirstName: "O primeiro nome é obrigatório",
    errorLastName: "O apelido é obrigatório",
    errorEmail: "O email é obrigatório",
    errorEmailInvalid: "Por favor introduz um email válido",
    errorServices: "Por favor seleciona pelo menos um serviço",
    errorMessage: "Por favor partilha alguns detalhes",
    errorGeneric: "Algo correu mal. Por favor tenta novamente.",

    // Form success
    successTitle: "Obrigado",
    successMessage: "Entraremos em contacto em breve.",
    successAnother: "Enviar outro pedido",

    // Footer
    footerRights: "Todos os direitos reservados.",

    // Language toggle
    langToggle: "EN",
  },
} as const;

export type Translations = { [K in keyof (typeof translations)["en"]]: string };
