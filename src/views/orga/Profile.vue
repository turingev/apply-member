<script setup>
import { generateKeypair } from "../../lib/crypto"
import AuthForm from "../../components/AuthForm.vue";
import Button from "primevue/button";
const onGenerateKeypair = async () => {
  const { exportPrivateKey, exportPublicKey } = await generateKeypair()
  console.log("private key", JSON.stringify(exportPrivateKey))
  console.log("public key", JSON.stringify(exportPublicKey))
}
</script>
<template>
  <h1>Profil Verwalten</h1>
  <h3>Neuen Benutzy anlegen</h3>
  <AuthForm auth-modus="regestrieren" />
  <p>Benutzy muss anschließend noch manuell aktiviert werden</p>
  <h3>RSA Keypair generieren</h3>
  <Button @click="onGenerateKeypair" label="Generieren (ausgabe in der Konsole)" />
</template>
