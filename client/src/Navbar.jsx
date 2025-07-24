


{/* TODO: if user not loged in display navbar with register and login */}
{/* TODO: if user loged in as USER display user navbar */}
{/* TODO: if user loged in as ADMIN display admin navbar (will have Admin and user related links)*/}
const Navbar = () => {

    const userRole = sessionStorage.getItem("user_role");
    return(
        <>
            {!userRole && <DefaultNavbar/>}
            {userRole === "USER" && <UserNavbar/>}
            {userRole === "ADMIN" && <AdminNavbar/>}
        </>
    )

}


const DefaultNavbar = () => {
    return(
        <>
        </>
    )
}


const UserNavbar = () => {
    return(
        <>
        </>
    )
}

const AdminNavbar = () => {
    return(
        <>
        </>
    )
}

export default Navbar;