import Vue from 'vue';

import adminApi from '../../api/admin';

export const getAllAdmins = async ({ commit }, page) => {
  try {
    const { data } = await adminApi.getAll(page);
    const { records, pagination } = data;
    commit('SET_ADMINS', records);
    return pagination;
  } catch (err) {
    Vue.$log.error(err);
    throw err;
  }
};

export const getAdmin = async (_, id) => {
  try {
    const { data } = await adminApi.get(id);
    return data;
  } catch (err) {
    Vue.$log.error(err);
    throw err;
  }
};

export const createAdmin = async (_, admin) => {
  try {
    await adminApi.create(admin);
  } catch (err) {
    Vue.$log.error(err);
    throw err;
  }
};

export const updateAdmin = async (_, { id, admin }) => {
  try {
    await adminApi.update(id, admin);
  } catch (err) {
    Vue.$log.error(err);
    throw err;
  }
};

export const deleteAdmin = async (_, id) => {
  try {
    const { data } = await adminApi.delete(id);
    return data;
  } catch (err) {
    Vue.$log.error(err);
    throw err;
  }
};
