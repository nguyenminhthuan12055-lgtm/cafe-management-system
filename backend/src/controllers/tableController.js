const tableService = require("../services/tableService");

const tableController = {
  getAllTables: async (req, res) => {
    try {
      const tables = await tableService.getAllTables();
      res.json({ status: "success", data: tables });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  },

  createTable: async (req, res) => {
    try {
      const { table_number, capacity } = req.body;
      const table = await tableService.addTable(table_number, capacity);
      res.json({ status: "success", message: "Thêm bàn thành công!", data: table });
    } catch (err) {
      res.status(400).json({ status: "error", message: err.message });
    }
  },

  updateTable: async (req, res) => {
    try {
      const { table_number, capacity } = req.body;
      const table = await tableService.editTable(req.params.id, table_number, capacity);
      res.json({ status: "success", message: "Cập nhật bàn thành công!", data: table });
    } catch (err) {
      res.status(400).json({ status: "error", message: err.message });
    }
  },

  updateTableStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const table = await tableService.changeTableStatus(req.params.id, status);
      res.json({ status: "success", message: "Cập nhật trạng thái bàn thành công!", data: table });
    } catch (err) {
      res.status(400).json({ status: "error", message: err.message });
    }
  },

  deleteTable: async (req, res) => {
    try {
      await tableService.deleteTable(req.params.id);
      res.json({ status: "success", message: "Xóa bàn thành công!" });
    } catch (err) {
      res.status(400).json({ status: "error", message: err.message });
    }
  },
};

module.exports = tableController;
