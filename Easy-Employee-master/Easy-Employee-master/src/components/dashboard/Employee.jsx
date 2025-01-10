import React,{ useState, useEffect }  from 'react';
import { useSelector } from 'react-redux';


const Employee = () => {
  const {user} = useSelector(state => state.authSlice);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 500); // Delay before showing the message
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="">
    <section className="section">
    <div className="card shadow-lg d-flex flex-row align-items-center p-3">
  {/* Card Header */}
  <div className="card-header border-0 me-3">
    <h4>Welcome {user?.name}</h4>
  </div>

  {/* Card Body */}
  <div className="card-body p-0">
    {showMessage && (
      <div className="slide-in text-success fw-bold fs-5">
        You are an amazing {user?.type}! 🎉
      </div>
    )}
  </div>
</div>



            <div className="card">
                  <div className="card-body row">
                    <div className="col-md-3 ">
                        <img className='img-fluid img-thumbnail' src={user.image} alt="" />
                    </div>
                    <div className="col-md-9">
                       <table className='table'>
                            <tbody>
                                <tr>
                                    <th>Name</th>
                                    <td>{user.name}</td>
                                </tr>
                                <tr>
                                    <th>Username</th>
                                    <td>{user.username}</td>
                                </tr>
                                <tr>
                                    <th>Email</th>
                                    <td>{user.email}</td>
                                </tr>
                                <tr>
                                    <th>Usertype</th>
                                    <td>{user.type}</td>
                                </tr>
                                <tr>
                                    <th>Status</th>
                                    <td>{user.status}</td>
                                </tr>
                                <tr>
                                    <th>Mobile</th>
                                    <td>{user.mobile}</td>
                                </tr>
                                <tr>
                                    <th>Address</th>
                                    <td>{user.address}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                  </div>
                </div>   
    </section>
  </div>
  )
}

export default Employee;
