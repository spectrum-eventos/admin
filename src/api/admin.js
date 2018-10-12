import Vue from 'vue';

export default {
  getAll: page => Vue.prototype.$axios.get(`/admins?page=${page}`),
  get: id => Vue.prototype.$axios.get(`/admins/${id}`),
  create: admin => Vue.prototype.$axios.post('/admins', admin),
  update: (id, admin) => Vue.prototype.$axios.put(`/admins/${id}`, admin),
  delete: id => Vue.prototype.$axios.delete(`/admins/${id}`),
};
