import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom"
import Admin from './Navigation/Admin';
import Leader from './Navigation/Leader';
import Employee from './Navigation/Employee';

const SideBar = () => {

  const {user} = useSelector(state => state.authSlice);
  
  return (
    <div className="main-sidebar">
  <aside id="sidebar-wrapper" className="d-flex flex-column vh-100 overflow-auto">
    <div className="sidebar-brand p-3">
      <NavLink to="/home">Staff Management</NavLink>
    </div>
    <div className="sidebar-brand sidebar-brand-sm p-3">
      <NavLink to="/home">TM</NavLink>
    </div>
    {
      (user.type === 'Admin') ? <Admin /> : (user.type === 'Leader') ? <Leader /> : <Employee />
    }
    <div className="mt-auto p-3">
      <a
        href="https://bibhudatta-portfolio-git-main-bibhu12321.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-primary btn-lg btn-block"
      >
        <i className="fas fa-rocket"></i> Developed By Bibhudatta
      </a>
    </div>
  </aside>
</div>

  )
}

export default SideBar;