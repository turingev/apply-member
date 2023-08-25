<script setup>
import { ref } from "vue";
import { createProposal } from "../lib/api";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import Card from 'primevue/card';
import ProgressSpinner from "primevue/progressspinner";
import Message from 'primevue/message';
import i18n from "../lib/i18n.json"

const proposal = ref({
  name: "",
  surname: "",
  birthday: "",
  email: "",
  phonenumber: "",
  street: "",
  housenumber: "",
  postalcode: "",
  city: "",
  iban: "",
  bank: "",
  contribution: "",
  message: "",
  captcha: "",
  approval: false,
});
const loading = ref(false)
const formSubmitStatus = ref('edit')

let text = i18n.de
const browserLanguage = navigator.language || navigator.userLanguage;
if (!browserLanguage.includes('de')) {
  text = i18n.en
}

const onSubmit = async () => {
  loading.value = true
  try {
    if (proposal.value.captcha.toLowerCase() !== "alan")
      throw Error("Wrong Captcha");
    await createProposal(proposal.value);
    formSubmitStatus.value = 'success'
  } catch (error) {
    console.error(error);
    formSubmitStatus.value = 'error'
  }
  finally {
    loading.value = false
  }
};
</script>
<template>
  <main>
    <Card>
      <template #title>{{ text.cta }}</template>
      <template #subtitle> <a href="https://ccs.chaostreff-flensburg.de/" target="_blank">{{ text.linkText }}</a>
      </template>
      <template #content>
        <template v-if="loading">
          <ProgressSpinner />
          {{ text.saveMessage }}
        </template>
        <template v-else>
          <template v-if="formSubmitStatus === 'edit'">
            <form @submit.prevent="onSubmit">
              <div class="formgrid grid ">
                <div class="field col flex flex-column">
                  <label for="username">Vorname</label>
                  <InputText id="username" v-model="proposal.name" required />
                </div>
                <div class="field col flex flex-column">
                  <label for="surname">Nachname</label>
                  <InputText id="surname" v-model="proposal.surname" required />
                </div>
                <div class="field col flex flex-column">
                  <label for="birthday">Geburtstag</label>
                  <InputText type="date" id="birthday" v-model="proposal.birthday" required />
                </div>
              </div>
              <div class="formgrid grid ">
                <div class="field col flex flex-column">
                  <label for="email">{{ text.email }}</label>
                  <InputText id="email" v-model="proposal.email" required />
                </div>
                <div class="field col flex flex-column">
                  <label for="phonenumber">{{ text.phonenumber }}</label>
                  <InputText id="phonenumber" v-model="proposal.phonenumber" />
                </div>
              </div>
              <div class="formgrid grid ">
                <div class="field col flex flex-column">
                  <label for="street">Strasse</label>
                  <InputText id="street" v-model="proposal.street" required />
                </div>
                <div class="field col-2 flex flex-column">
                  <label for="housenumber">Hausnummer</label>
                  <InputText id="housenumber" v-model="proposal.housenumber" required />
                </div>
                <div class="field col-2 flex flex-column">
                  <label for="postalcode">Postleitzahl</label>
                  <InputText id="postalcode" v-model="proposal.postalcode" required />
                </div>
                <div class="field col flex flex-column">
                  <label for="city">Stadt</label>
                  <InputText id="city" v-model="proposal.city" required />
                </div>
              </div>
              <div class="formgrid grid ">
                <div class="field col flex flex-column">
                  <label for="iban">IBAN</label>
                  <InputText id="iban" v-model="proposal.iban" required />
                </div>
                <div class="field col flex flex-column">
                  <label for="bank">Bankinstitut</label>
                  <InputText id="bank" v-model="proposal.bank" />
                </div>
                <div class="field col flex flex-column">
                  <label for="contribution">Freiwilliger Jahresförderbeitrag</label>
                  <InputText id="contribution" v-model="proposal.contribution" />
                </div>
              </div>
              <div class="field flex flex-column">
                <label for="message">
                  Deine Nachricht
                </label>
                <Textarea id="message" v-model="proposal.message" rows="7" max="1000" />
              </div>
              <div class="field grid">
                <div class="p-3">
                  <Checkbox v-model="proposal.approval" :binary="true" required />
                </div>
                <div class="col">
                  <p>
                    Ich ermächtige den Turing e.V., regelmäßig Zahlungen von meinem Konto mittels Lastschrift einzuziehen.
                    Zugleich weise ich mein Kreditinstitut an, die vom Turing e.V. auf mein Konto gezogenen Lastschriften
                    einzulösen.
                    Gläubiger-Identifikationsnummer: DE16ZZZ00002515473. Die Mandatsreferenz wird mit der Bestätigung der
                    Aufnahme mitgeteilt.
                    Hinweis: Ich kann innerhalb von acht Wochen, beginnend mit dem Belastungsdatum, die Erstattung des
                    belasteten Betrages verlangen. Es gelten dabei die mit meinem Kreditinstitut vereinbarten Bedingungen.
                  </p>
                </div>
              </div>
              <div class="field flex flex-column">
                <label for="captcha">
                  Captcha: Wie hiess Turing mit Vornamen?
                </label>
                <InputText id="captcha" v-model="proposal.captcha" />
              </div>
              <Button type="submit" :disabled="proposal.captcha.toLowerCase() !== 'alan'" :label="text.submit" />
            </form>
          </template>
          <template v-else-if="formSubmitStatus === 'success'">
            <Message :closable="false" severity="success">
              {{ text.successMessage }}
            </Message>
          </template>
          <template v-else-if="formSubmitStatus === 'error'">
            <Message :closable="false" severity="error">
              {{ text.errorMessage }}
              senden.
            </Message>
            <Textarea :rows="5" :modelValue="JSON.stringify(proposal)" />
          </template>
        </template>
      </template>
    </Card>
  </main>
</template>
