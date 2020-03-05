import React from 'react'
import { render } from 'react-dom'
import { BLOG_NAME } from './constants'

function Header() {
    return (
        <div className='header'><p>{BLOG_NAME}</p></div>
    )
}

interface NavItemProps {
    title: string
    link: string
}

function NavItem({ title, link }: NavItemProps) {
    return (
        <p><a href={link}>{title}</a></p>
    )
}

interface NavProps {
    items: Array<NavItemProps>
}

function Nav({ items }: NavProps) {
    return (
        <div className='nav'>
            {items.map(function (item, index) {
                return <NavItem key={index} title={item.title} link={item.link} />
            })}
        </div>
    )
}

interface SidebarProps {
    sidebarType: 'left' | 'right'
    imgSrc: string
}

function Sidebar({ sidebarType, imgSrc }: SidebarProps) {
    return (
        <div className={`${sidebarType}-bar`}>
            <div className='place-holder'>
                <img src={imgSrc} />
            </div>
        </div>
    )
}

function MainArea() {
    return (
        <div className='main-content'></div>
    )
}

let navItems = [
    { title: 'novels', link: './novels' },
    { title: 'enchant.js rpg', link: './rpg' },
    { title: 'Pong', link: './tennis-game' },
    { title: 'Tic Tac Toe', link: './tictactoe' }
]

function App() {
    return (
        <div id='main'>
            <Header />
            <Nav items={navItems} />
            <div className='container'>
                <Sidebar sidebarType='left' imgSrc='./images/kt-00.png' />
                <MainArea />
                <Sidebar sidebarType='right' imgSrc='./images/kt-01.png' />
            </div>
        </div>
    )
}

let container = document.getElementById('container')

render(<App />, container)