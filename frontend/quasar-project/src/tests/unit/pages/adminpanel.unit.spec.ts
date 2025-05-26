import { mount } from '@vue/test-utils'
import AdminPanel from 'src/pages/AdminPanel.vue'

describe('AdminPanel.vue - Unit', () => {
  it('renderuje osnovne elemente forme', () => {
    const wrapper = mount(AdminPanel)
    expect(wrapper.text()).toContain('Administratorska ploča')
    expect(wrapper.find('input[label="Naziv"]').exists()).toBe(true)
    expect(wrapper.find('input[label="Opis"]').exists()).toBe(true)
  })

  it('pokazuje polje za novu kategoriju kad se klikne "+"', async () => {
    const wrapper = mount(AdminPanel)
    await wrapper.find('button[icon="add"]').trigger('click')
    expect(wrapper.text()).toContain('Nova kategorija')
  })
})
