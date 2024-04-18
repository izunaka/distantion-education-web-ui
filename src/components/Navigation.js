import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
import { FaBook, FaList, FaPlusCircle, FaCog } from 'react-icons/fa'
import { Link } from 'react-router-dom'

function Navigation() {
    return (
        <Navbar bg="primary" data-bs-theme="primary" expand="lg">
            <Container>
                <Navbar.Brand>
                    <Link to="/works" style={{ color: 'white', textDecoration: 'none' }}><FaBook /> Вопросник</Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Link to="/works" className='mx-2' style={{ color: 'white', textDecoration: 'none' }}><FaList /> Все работы</Link>
                        <Link to="/new" className='mx-2' style={{ color: 'white', textDecoration: 'none' }}><FaPlusCircle /> Создать работу</Link>
                        <Link to="/settings" className='mx-2' style={{ color: 'white', textDecoration: 'none' }}><FaCog /> Настройки</Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Navigation