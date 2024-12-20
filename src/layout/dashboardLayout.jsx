import { NavbarUser, Sidebar } from "../components/Dashboard";
import { Outlet } from 'react-router-dom';

const DashboardLayout = () =>
{
  return (
    <>
      <div className="container">
        <div className="row">
          <div>
            <Sidebar />
          </div>
          <div className="col-11 px-0">
            <NavbarUser />
            <Outlet />
          </div>
        </div>
      </div>
    </>

  )

}

export default DashboardLayout; 