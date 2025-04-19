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
          <div class="q-pa-md">
            <div class="text-h5 q-mb-md text-center">Moje narudžbe</div>
            <div v-if="orders.length === 0" class="text-subtitle1 text-center text-grey">
              Ovdje će se prikazivati vaše narudžbe.
            </div>
            <q-scroll-area style="max-width: 100%; height: 200px">
              <div class="row no-wrap q-gutter-md">
                <q-card
                  v-for="order in sortedOrders"
                  :key="order.id"
                  class="q-pa-md col-12 col-sm-6 col-md-4"
                  style="min-width: 250px; max-width: 300px"
                  bordered
                  flat
                >
                  <div class="text-subtitle1"><strong>Broj narudžbe:</strong> {{ order.id }}</div>
                  <div class="q-mt-sm">
                    <div>
                      <strong>Status narudžbe: </strong>
                      <span
                        :class="{
                          'text-green': order.status === 'Dovršeno',
                          'text-red': order.status === 'Povučeno',
                        }"
                        >{{ order.status }}</span
                      >
                    </div>
                    <div class="q-mt-sm">
                      <strong>Datum narudžbe:</strong><br />{{ order.date }}<br />{{ order.time }}
                    </div>
                    <div class="q-mt-sm"><strong>Ukupni iznos:</strong> {{ order.total }} €</div>
                  </div>
                </q-card>
              </div>
            </q-scroll-area>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('informacije')
const password = ref('')
const newpassword = ref('')
const confirmpassword = ref('')

const showPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Privremene narudzbe samo za primjer
const orders = [
  {
    id: '243112',
    status: 'Dovršeno',
    date: '9.11.2023.',
    time: '11:37:10',
    total: '359,94',
  },
  {
    id: '224557',
    status: 'Dovršeno',
    date: '12.5.2023.',
    time: '12:54:21',
    total: '21,99',
  },
  {
    id: '212530',
    status: 'Povučeno',
    date: '7.3.2023.',
    time: '17:46:31',
    total: '125,43',
  },
]

const sortedOrders = computed(() => {
  {
    return [...orders].sort((a, b) => Number(b.id) - Number(a.id))
  }
})
</script>
