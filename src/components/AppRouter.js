import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { routes } from '../route'

function AppRouter() {
    return (
        <Routes>
            { 
                routes.map(({ path, Component }) => (
                    <Route path={path} Component={Component} key={path} exact />
                )) 
            }
        </Routes>
    )
}

export default AppRouter