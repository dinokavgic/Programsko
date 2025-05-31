import { mount } from '@vue/test-utils'
import NewArticleForm from 'src/components/NewArticleForm.vue'
import { Quasar, QInput, QSelect, QBtn, QCard } from 'quasar'

describe('NewArticleForm.vue – Unit Test', () => {
    it('emituje submitted događaj s ispravnim podacima', async () => {
        const wrapper = mount(NewArticleForm, {
            global: {
                plugins: [Quasar],
                components: { QInput, QSelect, QBtn, QCard }
            }
        })

        const inputTitle = wrapper.find('input')
        await inputTitle.setValue('Test naslov')

        const selectCategory = wrapper.findComponent(QSelect)
        await selectCategory.vm.$emit('update:modelValue', 'Općenito')

        const textarea = wrapper.find('textarea')
        await textarea.setValue('Ovo je testni tekst.')

        const submitBtn = wrapper.findAllComponents(QBtn).find(b => b.text() === 'Objavi')
        expect(submitBtn).toBeTruthy()

        await submitBtn.trigger('click')

        const events = wrapper.emitted('submitted')
        expect(events).toBeTruthy()
        expect(events[0][0]).toMatchObject({
            title: 'Test naslov',
            category: 'Općenito',
            text: 'Ovo je testni tekst.'
        })
    })
})
