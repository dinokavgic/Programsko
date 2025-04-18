<template>
  <q-page class="q-pa-xl bg-grey-2">
    <q-card class="q-pa-md q-mb-md shadow-1">
      <div class="text-h5 text-center text-bold">Profil</div>
    </q-card>

    <q-card class="q-pa-md">
      <q-tabs
        v-model="activeTab"
        class="text-primary"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
      >
        <q-tab name="informacije" label="Informacije" />
        <q-tab name="lozinka" label="Promjena lozinke" />
        <q-tab name="narudzbe" label="Narudžbe" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="activeTab" animated>
        <q-tab-panel name="informacije">
          <div class="text-center">
            <h2 class="text-h5">Informacije o računu</h2>
          </div>

          <q-form>
            <div class="q-gutter-md">
              <div class="q-gutter-md">
                <q-field label="Ime i Prezime">
                  <q-input v-model="imePrezime" class="full-width" />
                </q-field>
                <q-field label="E-mail">
                  <q-input v-model="email" class="full-width" readonly="" />
                </q-field>
                <q-field label="Telefon">
                  <q-input v-model="telefon" class="full-width" type="number" />
                </q-field>
              </div>

              <div class="q-row q-gutter-md">
                <q-field label="Adresa">
                  <q-input v-model="adresa" class="full-width" />
                </q-field>
                <q-field label="Mjesto">
                  <q-input v-model="mjesto" class="full-width" />
                </q-field>
                <q-field label="ZIP">
                  <q-input v-model="zip" class="full-width" type="number" />
                </q-field>
              </div>

              <div class="q-mt-md q-gutter-md flex justify-center">
                <div class="q-btn-container">
                  <q-btn label="Spremi" color="primary" class="q-ml-none q-mr-auto" />
                </div>
              </div>
            </div>
          </q-form>
        </q-tab-panel>

        <q-tab-panel name="lozinka">
          <div class="text-center">
            <h2 class="text-h5">Promjena lozinke</h2>
          </div>

          <q-form>
            <div class="q-gutter-md">
              <div class="q-gutter-md">
                <q-field label="Stara lozinka">
                  <q-input
                    v-model="password"
                    class="full-width"
                    :type="showPassword ? 'text' : 'password'"
                    :append="showPassword ? 'visibility' : 'visibility_off'"
                    @mousedown="showPassword = true"
                    @mouseup="showPassword = false"
                    @mouseleave="showPassword = false"
                  />
                </q-field>
                <q-field label="Nova lozinka">
                  <q-input
                    v-model="newpassword"
                    class="full-width"
                    :type="showNewPassword ? 'text' : 'password'"
                    :append="showNewPassword ? 'visibility' : 'visibility_off'"
                    @mousedown="showNewPassword = true"
                    @mouseup="showNewPassword = false"
                    @mouseleave="showNewPassword = false"
                  />
                </q-field>
                <q-field label="Potvrdite lozinku">
                  <q-input
                    v-model="confirmpassword"
                    class="full-width"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    :append="showConfirmPassword ? 'visibility' : 'visibility_off'"
                    @mousedown="showConfirmPassword = true"
                    @mouseup="showConfirmPassword = false"
                    @mouseleave="showConfirmPassword = false"
                  />
                </q-field>
              </div>

              <div class="q-mt-md q-gutter-md flex justify-center">
                <div class="q-btn-container">
                  <q-btn label="Promijeni" color="primary" class="q-ml-none q-mr-auto" />
                </div>
              </div>
            </div>
          </q-form>
        </q-tab-panel>

        <q-tab-panel name="narudzbe">
          <!-- Prazno za sada -->
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('informacije')
const password = ref('')
const newpassword = ref('')
const confirmpassword = ref('')

const showPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
</script>
