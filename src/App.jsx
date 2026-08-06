import React, { useState, useEffect } from 'react';
import  Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './pages/Dashboard/Dashboard';
import ChartsSection from './pages/Dashboard/components/ChartsSection';


const App = () => {

  const [collapsed,setCollapsed]=useState(false);
  const [currentPage, setCurrentPage]=useState('dashboard');
  const [darkMode, setDarkMode]=useState('true');

  useEffect(()=>{
    if(darkMode){
      document.documentElement.classList.add('dark');
    }
    else{
      document.documentElement.classList.remove('dark');
    }
  },[darkMode]);
  return (
    <div className='app-container'>
      <Sidebar 
      collapsed={collapsed}
      setCollapsed={setCollapsed}
      currentPage={currentPage}
      onPageChange={setCurrentPage}/>
      <div className='main-wrapper'>
      <Header
      onToggleSidebar={()=> setCollapsed(!collapsed)}
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      
      />
      <Dashboard/>
      <ChartsSection/>
      </div>
      
    </div>
  )
}

export default App
