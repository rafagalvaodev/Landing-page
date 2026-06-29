const ctaButton = document.querySelector("#ctaButton");
const ctaMessage = document.querySelector("#ctaMessage");
const cepForm = document.querySelector("#cepForm");
const cepInput = document.querySelector("#cep");
const cepFeedback = document.querySelector("#cepFeedback");
const contactForm = document.querySelector("#contactForm");
const contactFeedback = document.querySelector("#contactFeedback");

const addressFields = {
  logradouro: document.querySelector("#logradouro"),
  bairro: document.querySelector("#bairro"),
  cidade: document.querySelector("#cidade"),
  uf: document.querySelector("#uf"),
};

function setFeedback(element, message, type = "") {
  element.textContent = message;
  element.className = `form-feedback ${type}`.trim();
}

function clearAddress() {
  Object.values(addressFields).forEach((field) => {
    field.value = "";
  });
}

function formatCep(value) {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  if (digits.length > 5) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }

  return digits;
}

ctaButton.addEventListener("click", () => {
  ctaMessage.textContent = "Obrigado pelo interesse! Preencha o formulário para participar.";
  document.querySelector("#contato").scrollIntoView({ behavior: "smooth" });
});

cepInput.addEventListener("input", () => {
  cepInput.value = formatCep(cepInput.value);
});

cepForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const cep = cepInput.value.replace(/\D/g, "");
  clearAddress();
  setFeedback(cepFeedback, "");

  if (cep.length !== 8) {
    setFeedback(cepFeedback, "Digite um CEP com 8 números.", "error");
    return;
  }

  setFeedback(cepFeedback, "Buscando endereço...");

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    if (data.erro) {
      setFeedback(cepFeedback, "CEP não encontrado.", "error");
      return;
    }

    addressFields.logradouro.value = data.logradouro || "Não informado";
    addressFields.bairro.value = data.bairro || "Não informado";
    addressFields.cidade.value = data.localidade || "Não informado";
    addressFields.uf.value = data.uf || "Não informado";
    setFeedback(cepFeedback, "Endereço encontrado com sucesso.", "success");
  } catch (error) {
    setFeedback(cepFeedback, "Não foi possível consultar o ViaCEP agora.", "error");
  }
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  contactForm.reset();
  setFeedback(contactFeedback, "Cadastro enviado com sucesso!", "success");
});
