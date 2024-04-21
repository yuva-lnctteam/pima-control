// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// // My components
// import HeaderCard from "../../components/common/HeaderCard";
// import { CardGrid } from "../../components/common/CardGrid";
// import SecCard from "../../components/common/SecCard";

// // My css
// import css from "../../css/admin/home-page.module.css";

// import { SERVER_ORIGIN } from "../../utilities/constants";
// import Loader from "../../components/common/Loader";

// const HomePage = () => {
//     const [isLoading, setIsLoading] = useState(false);

//     const navigate = useNavigate();

//     useEffect(() => {
//         async function canVisitPage() {
//             setIsLoading(true);

//             try {
//                 const adminId = process.env.REACT_APP_ADMIN_ID;
//                 const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
//                 const basicAuth = btoa(`${adminId}:${adminPassword}`);
//                 const response = await fetch(
//                     `${SERVER_ORIGIN}/api/admin/auth/verify-token`,
//                     {
//                         method: "POST",
//                         headers: {
//                             "Content-Type": "application/json",
//                             "auth-token": localStorage.getItem("token"),
//                             Authorization: `Basic ${basicAuth}`,
//                         },
//                     }
//                 );

//                 const result = await response.json();
//                 // (result);

//                 if (response.status >= 400 && response.status < 600) {
//                     if (response.status === 401) {
//                           navigate("/admin/login");
//                     }
//                 } else if (response.ok && response.status === 200) {
//                 } else {
//                     // for future
//                 }
//             } catch (err) {
//                 // (err.message);
//             }

//             setIsLoading(false);
//         }

//         canVisitPage();
//     }, []);

//     function handleContentClick() {
//         navigate("/admin/verticals/all");
//     }

//     function handleUsersClick() {
//         navigate("/admin/users/all");
//     }

//     return isLoading ? (
//         <Loader />
//     ) : (
//         <div className={css.outerDiv}>
//             <HeaderCard>
//                 <h1 className="headerTitle">
//                     Welcome to the platform analysis
//                 </h1>
//                 <hr />
//                 <p className="headerSubtitle">
//                     You can control the complete data on the portal from this
//                     panel. You will also get a view-only list of all the users
//                     registered on platform.
//                 </p>
//             </HeaderCard>
//             <div className={css.serviceCardGrid} key={1}>
//                 <SecCard>
//                     <h1 className={css.serviceName}>Manage Content</h1>
//                     <p className={css.serviceDesc}>
//                         You can manage the content on the portal by clicking on
//                         below button
//                     </p>
//                     <button
//                         className={`${css.serviceBtn} commonBtn`}
//                         onClick={handleContentClick}
//                     >
//                         Manage content
//                     </button>
//                 </SecCard>
//                 <SecCard>
//                     <h1 className={css.serviceName}>Manage Users</h1>
//                     <p className={css.serviceDesc}>
//                         You can manage the users on the portal by clicking on
//                         below button
//                     </p>
//                     <button
//                         className={`${css.serviceBtn} commonBtn`}
//                         onClick={handleUsersClick}
//                     >
//                         Manage users
//                     </button>
//                 </SecCard>
//             </div>
//             {/* <CardGrid>
//         <div className="cardOuterDiv col-lg-6 col-md-6 col-sm-12" key={1}>
//           <SecCard>
//             <h1 className={css.serviceName}>Users List</h1>
//             <p className={css.serviceDesc}>
//               You can access the list of registered users by clicking on the below button
//             </p>
//             <button
//               className={`${css.serviceBtn} commonBtn`}
//               onClick={handleUsersClick}
//             >
//               View User List
//             </button>
//           </SecCard>
//         </div>
//       </CardGrid> */}
//         </div>
//     );
// };

// export default HomePage;
