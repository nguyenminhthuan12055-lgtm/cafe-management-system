const Table = require("../models/tableModel");

const tableService = {
  getAllTables: async () => {
    return await Table.getAll();
  },

  addTable: async (table_number, capacity) => {
    if (!table_number || !capacity) {
      throw new Error("Vui lòng nhập đầy đủ số bàn và sức chứa!");
    }
    if (capacity <= 0) {
      throw new Error("Sức chứa phải lớn hơn 0!");
    }
    return await Table.create(table_number, capacity);
  },

  editTable: async (id, table_number, capacity) => {
    const existing = await Table.getById(id);
    if (!existing) {
      throw new Error("Không tìm thấy bàn này!");
    }
    if (!table_number || !capacity) {
      throw new Error("Vui lòng nhập đầy đủ số bàn và sức chứa!");
    }
    return await Table.update(id, table_number, capacity);
  },

  changeTableStatus: async (id, status) => {
    const validStatuses = ["Available", "Reserved", "Occupied"];
    if (!validStatuses.includes(status)) {
      throw new Error("Trạng thái bàn không hợp lệ!");
    }
    const existing = await Table.getById(id);
    if (!existing) {
      throw new Error("Không tìm thấy bàn này!");
    }
    return await Table.updateStatus(id, status);
  },

  deleteTable: async (id) => {
    const existing = await Table.getById(id);
    if (!existing) {
      throw new Error("Không tìm thấy bàn này!");
    }
    return await Table.remove(id);
  },
};

module.exports = tableService;
