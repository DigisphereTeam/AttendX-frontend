import { useMemo, useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { FiPlus, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";

import TablePagination from "../../../components/TablePagination/TablePagination";
import TableToolbar from "../../../components/TableToolbar/TableToolbar";
import DataTable from "../../../components/DataTable/DataTable";
import CommonModal from "../../../components/CommonModal/CommonModal";
import Button from "../../../components/Button/Button";

const PAYMENT_METHODS = ["UPI", "Bank Transfer", "Cash"];

const Expenditure = () => {
  const emptyExpenditure = {
    title: "",
    amount: "",
    paymentMethod: "UPI",
    date: "",
    purpose: "",
  };

  const [expenditureForm, setExpenditureForm] = useState(emptyExpenditure);
  const [expenditureModal, setExpenditureModal] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    paymentMethod: "",
  });

  const [expenditures, setExpenditures] = useState([
    {
      expenditureId: 1,
      title: "Office Rent",
      amount: 25000,
      paymentMethod: "Bank Transfer",
      date: "2026-09-01",
      purpose: "Monthly office rent payment",
    },
    {
      expenditureId: 2,
      title: "Internet Bill",
      amount: 2499,
      paymentMethod: "UPI",
      date: "2026-09-02",
      purpose: "Monthly broadband and internet charges",
    },
    {
      expenditureId: 3,
      title: "Office Supplies",
      amount: 4850,
      paymentMethod: "Cash",
      date: "2026-09-03",
      purpose: "Stationery, printer paper, pens and other supplies",
    },
    {
      expenditureId: 4,
      title: "Electricity Bill",
      amount: 7320,
      paymentMethod: "Bank Transfer",
      date: "2026-09-04",
      purpose: "Monthly electricity bill",
    },
    {
      expenditureId: 5,
      title: "Team Lunch",
      amount: 3650,
      paymentMethod: "UPI",
      date: "2026-09-05",
      purpose: "Team lunch and refreshments",
    },
    {
      expenditureId: 6,
      title: "Printer Maintenance",
      amount: 1800,
      paymentMethod: "Cash",
      date: "2026-09-06",
      purpose: "Printer servicing and maintenance",
    },
    {
      expenditureId: 7,
      title: "Travel Expenses",
      amount: 6250,
      paymentMethod: "UPI",
      date: "2026-09-07",
      purpose: "Local travel expenses for client meetings",
    },
    {
      expenditureId: 8,
      title: "Software Subscription",
      amount: 4999,
      paymentMethod: "Bank Transfer",
      date: "2026-09-08",
      purpose: "Monthly software and productivity tools subscription",
    },
    {
      expenditureId: 9,
      title: "Cleaning Services",
      amount: 3200,
      paymentMethod: "Cash",
      date: "2026-09-09",
      purpose: "Office cleaning and housekeeping services",
    },
    {
      expenditureId: 10,
      title: "Marketing Materials",
      amount: 8750,
      paymentMethod: "Bank Transfer",
      date: "2026-09-10",
      purpose: "Printing brochures, flyers and promotional materials",
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Handle form changes
  const handleExpenditureChange = (e) => {
    const { name, value } = e.target;
    setExpenditureForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Table columns
  const columns = useMemo(
    () => [
      {
        key: "title",
        header: "Title",
      },
      {
        key: "amount",
        header: "Amount",
        render: (row) => (
          <span>₹ {Number(row.amount).toLocaleString("en-IN")}</span>
        ),
      },
      {
        key: "paymentMethod",
        header: "Payment Method",
      },
      {
        key: "date",
        header: "Date",
      },
      {
        key: "purpose",
        header: "Purpose",
      },
    ],
    []
  );

  // Open Add Expenditure Modal
  const handleOpenModal = () => {
    setExpenditureForm({ ...emptyExpenditure });
    setExpenditureModal(true);
  };

  // Close Add Expenditure Modal
  const handleCloseModal = () => {
    setExpenditureModal(false);
    setExpenditureForm({ ...emptyExpenditure });
  };

  // Save Expenditure
  const handleSaveExpenditure = (e) => {
    e.preventDefault();

    if (
      !expenditureForm.title ||
      !expenditureForm.amount ||
      !expenditureForm.date ||
      !expenditureForm.paymentMethod
    ) {
      toast.error("Please fill required fields");
      return;
    }

    const amount = Number(
      String(expenditureForm.amount).replace(/[^0-9.]/g, "")
    );

    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const newExpenditure = {
      expenditureId: Date.now(),
      title: expenditureForm.title,
      amount,
      paymentMethod: expenditureForm.paymentMethod,
      date: expenditureForm.date,
      purpose: expenditureForm.purpose,
    };

    setExpenditures((prev) => [newExpenditure, ...prev]);
    toast.success("Expenditure added successfully");
    setCurrentPage(1);
    handleCloseModal();
  };

  // Handle toolbar changes
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      search: "",
      paymentMethod: "",
    });
    setCurrentPage(1);
  };

  // Filter & Search Logic
  const filteredExpenditures = useMemo(() => {
    return expenditures.filter((item) => {
      const searchValue = filters.search.trim().toLowerCase();

      const searchMatch =
        !searchValue ||
        item.title?.toLowerCase().includes(searchValue) ||
        item.paymentMethod?.toLowerCase().includes(searchValue) ||
        item.amount?.toString().includes(searchValue) ||
        item.date?.toLowerCase().includes(searchValue) ||
        item.purpose?.toLowerCase().includes(searchValue);

      const paymentMatch =
        !filters.paymentMethod ||
        item.paymentMethod === filters.paymentMethod;

      return searchMatch && paymentMatch;
    });
  }, [expenditures, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredExpenditures.length / pageSize);

  const safeCurrentPage =
    currentPage > totalPages ? totalPages || 1 : currentPage;

  const paginatedExpenditures = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return filteredExpenditures.slice(startIndex, startIndex + pageSize);
  }, [filteredExpenditures, safeCurrentPage]);

  return (
    <div className="employee-management">
      <div className="department-content-header">
        <div>
          <h1>Expenditure Management</h1>
          <p>Manage and track organization's expenditures.</p>
        </div>
        <Button icon={FiPlus} onClick={handleOpenModal}>
          Add Expenditure
        </Button>
      </div>

      {/* Filter and Toolbar */}
      <TableToolbar
        filters={[
          {
            type: "search",
            name: "search",
            placeholder: "Search expenditures...",
          },
          {
            type: "select",
            name: "paymentMethod",
            placeholder: "Payment",
            options: PAYMENT_METHODS.map((method) => ({
              value: method,
              label: method,
            })),
          },
        ]}
        values={filters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      {/* Expenditure Table */}
      <DataTable
        columns={columns}
        data={paginatedExpenditures}
        rowKey="expenditureId"
        loading={false}
        emptyMessage="No expenditures found."
      />

      {/* Pagination */}
      {filteredExpenditures.length > 0 && (
        <TablePagination
          page={safeCurrentPage}
          totalPages={totalPages}
          totalRecords={filteredExpenditures.length}
          pageSize={pageSize}
          onPrevious={() => setCurrentPage((prev) => prev - 1)}
          onNext={() => setCurrentPage((prev) => prev + 1)}
        />
      )}

      {/* Add Expenditure Modal */}
      <CommonModal
        isOpen={expenditureModal}
        onClose={handleCloseModal}
        title="Add Expenditure"
        subtitle="Record a new organization expenditure."
      >
        <form onSubmit={handleSaveExpenditure}>
          <div className="d-flex flex-column gap-3">
            {/* Expenditure Title */}
            <div>
              <Form.Label className="form-label fw-semibold small text-secondary mb-1">
                Title <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={expenditureForm.title}
                onChange={handleExpenditureChange}
                placeholder="Add expenditure name"
                className="shadow-none"
                required
              />
            </div>

            <Row className="g-3">
              {/* Amount */}
              <Col md={6}>
                <div>
                  <Form.Label className="form-label fw-semibold small text-secondary mb-1">
                    Amount (₹) <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="amount"
                    value={expenditureForm.amount}
                    onChange={handleExpenditureChange}
                    placeholder="Enter amount"
                    className="shadow-none"
                    required
                  />
                </div>
              </Col>

              {/* Payment Method */}
              <Col md={6}>
                <div>
                  <Form.Label className="form-label fw-semibold small text-secondary mb-1">
                    Payment Type <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="paymentMethod"
                    value={expenditureForm.paymentMethod}
                    onChange={handleExpenditureChange}
                    className="shadow-none"
                    required
                  >
                    {PAYMENT_METHODS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </Col>
            </Row>

            {/* Expense Date */}
            <div>
              <Form.Label className="form-label fw-semibold small text-secondary mb-1">
                Date <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={expenditureForm.date}
                onChange={handleExpenditureChange}
                className="shadow-none"
                required
              />
            </div>

            {/* Purpose / Description */}
            <div>
              <Form.Label className="form-label fw-semibold small text-secondary mb-1">
                Purpose
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="purpose"
                value={expenditureForm.purpose}
                onChange={handleExpenditureChange}
                placeholder="Add optional expense details..."
                className="shadow-none"
              />
            </div>
          </div>

          {/* Modal Action Footer */}
          <div className="pt-4 d-flex justify-content-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={FiCheck}>
              Save Expenditure
            </Button>
          </div>
        </form>
      </CommonModal>
    </div>
  );
};

export default Expenditure;