import { NavbarUser, Sidebar } from "../components/Dashboard";
import { Outlet } from 'react-router-dom';

const DashboardLayout = () =>
{
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-2">
            <Sidebar />
          </div>
          <div className="col-10 px-0">
            <NavbarUser />
            <Outlet />
          </div>
        </div>
      </div>
    </>

  )

}

export default DashboardLayout; 