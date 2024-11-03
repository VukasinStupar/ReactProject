import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import AllCompanies from "./components/AllCompanies";
import CreateCompany from "./components/CreateCompany";
import AllEquipments from "./components/AllEquipments";
import CreateEquipment from "./components/CreateEquipment";
import AllUsers from "./components/AllUsers";
import CompanyPageAdmin from "./components/CompanyPageAdmin";
import AllAppointments from "./components/AllAppointments";
import AllComplaints from "./components/AllComplaints";
import CreateAppointment from "./components/CreateAppointment";
import CompanyPageUser from "./components/CompanyPageUser";
import AllReservations from "./components/AllReservations";
import UserFutureReservations from "./components/UserFutureReservations";
import CancelReservation from "./components/CancelReservation";
import RespondeToComplaint from "./components/RespondeToComplaint";
import UserComplaints from "./components/UserComplaints";
import ComplaintForm from "./components/ComplaintForm";
import ScheduledReservations from "./components/ScheduledReservations";
import TakeReservation from "./components/TakeReservation";
import GradeCompany from "./components/GradeCompany";
import AllGradesForUser from "./components/AllGradesForUser";
import GradeDetail from "./components/GradeDetail";
import EquipmentCharts from "./components/Charts/EquipmentChart";
import MonthIncome from "./components/Charts/MonthIncome";
import ReservationCountForYear from "./components/Charts/ReservationCountForYear";
import ProductsIncome from "./components/Charts/ProductsIncome";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/companies" element={<AllCompanies />} />
        <Route path="/createCompany" element={<CreateCompany />} />
        <Route path="/equipments" element={<AllEquipments />} />
        <Route path="/createEquipments" element={<CreateEquipment />} />
        <Route path="/users" element={<AllUsers />} />
        <Route path="/companyPageAdmin/:id" element={<CompanyPageAdmin />} />
        <Route path="/companyPageUser/:id" element={<CompanyPageUser />} />
        <Route path="/appointments" element={<AllAppointments />} />
        <Route path="/complaints" element={<AllComplaints />} />
        <Route path="/createAppointment" element={<CreateAppointment />} />
        <Route path="/reservations" element={<AllReservations />} />
        <Route
          path="/userFutureReservations"
          element={<UserFutureReservations />}
        />
        <Route path="/cancelReservation/:id" element={<CancelReservation />} />
        <Route
          path="/respondeToComplaint/:id"
          element={<RespondeToComplaint />}
        />
        <Route path="/userComplaints" element={<UserComplaints />} />
        <Route path="/complaintForm" element={<ComplaintForm />} />
        <Route
          path="/scheduledReservations"
          element={<ScheduledReservations />}
        />
        <Route path="/takeReservation/:id" element={<TakeReservation />} />
        <Route path="/gradeCompany/:id" element={<GradeCompany />} />
        <Route path="/allGradesForUser" element={<AllGradesForUser />} />
        <Route path="/gradeDetail/:id" element={<GradeDetail />} />
        <Route path="/equipmentCharts" element={<EquipmentCharts />} />
        <Route path="/monthIncome" element={<MonthIncome />} />
        <Route
          path="/reservationCountForYear"
          element={<ReservationCountForYear />}
        />
        <Route path="/productsIncome" element={<ProductsIncome />} />
      </Routes>
    </Router>
  );
}

export default App;
