import React, { useMemo, useCallback, useEffect, useRef, useState, ChangeEvent } from 'react';
import { LuMoreHorizontal, LuSettings2 } from 'react-icons/lu';
import { GrAdd } from 'react-icons/gr';
import { BiChevronDown } from 'react-icons/bi';
import { getStatusIcon, getPriorityIcon } from './utils/helper';
import { Ticket, User } from './interface';
import './components.css';

function TicketCard({ ticket, userData, hideStatusIcon, hideProfileIcon }) {
  return (
    <div className='ticket-card'>
      <div className='top-container'>
        <div className='ticket-id'>{ticket.id}</div>
        {hideProfileIcon ? null : <UserBadge name={userData.name} available={userData.available} />}
      </div>
      <div className='middle-container'>
        {hideStatusIcon ? null : getStatusIcon(ticket.status)}
        <div className='title'>{ticket.title}</div>
      </div>
      <div className='bottom-container'>
        <div className='more-icon-container'>
          <LuMoreHorizontal color="#797d84" />
        </div>
        {ticket.tag.map((t) => (
          <div key={t} className='tag-container'>
            <div className='tag-icon'></div>
            <div className='tag-text'>{t}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TicketColumn({ tickets, grouping, groupBy, userIdToData }) {
  const title = useMemo(() => {
    if (grouping === "status") return groupBy;
    if (grouping === "priority") return groupBy;
    if (grouping === "user") return userIdToData[groupBy].name;
  }, [grouping, groupBy]);

  const icon = useMemo(() => {
    if (grouping === "status") return getStatusIcon(groupBy);
    if (grouping === "priority") return getPriorityIcon(groupBy);
    if (grouping === "user") return <UserBadge name={userIdToData[groupBy].name} available={userIdToData[groupBy].available} />;
  }, [grouping, groupBy]);

  return (
    <div className='column'>
      <div className='column-header'>
        <div className='column-header-left-container'>
          {icon}
          <div className='column-title'>
            {title}
            <span className='count'>{tickets.length}</span>
          </div>
        </div>
        <div className='column-header-right-container'>
          <GrAdd color="#797d84" size={12} />
          <LuMoreHorizontal color="#797d84" size={14} />
        </div>
      </div>
      <div className='cards-container'>
        {tickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} userData={userIdToData[ticket.userId]} hideStatusIcon={grouping === "status"} hideProfileIcon={grouping === "user"} />)}
      </div>
    </div>
  );
}

function DisplayDropdownMenu({ grouping, setGrouping, ordering, setOrdering }) {
  const [visible, setVisible] = useState(false);
  const componentRef = useRef(null);

  const openDropdown = useCallback(() => {
    setVisible(true);
  }, []);

  const handleClickOutside = useCallback((event) => {
    if (componentRef.current && !componentRef.current.contains(event.target)) {
      setVisible(false);
    }
  }, []);

  const onGroupingChange = useCallback((e) => setGrouping(e.target.value), []);
  const onOrderingChange = useCallback((e) => setOrdering(e.target.value), []);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className='display-dropdown' ref={componentRef}>
      <div className='dropdown-label-container' onClick={openDropdown}>
        <LuSettings2 color='#6b6f76' />
        <div className='dropdown-label'>Display</div>
        <BiChevronDown color='#6b6f76' />
      </div>
      <div className={`dropdown-content-container ${visible && "visible"}`}>
        <div className='dropdown-content-row'>
          <div className='dropdown-content-label'>Grouping</div>
          <select name="grouping" id="grouping" value={grouping} onChange={onGroupingChange}>
            <option value="status">Status</option>
            <option value="user">User</option>
            <option value="priority">Priority</option>
          </select>
        </div>
        <div className='dropdown-content-row'>
          <div className='dropdown-content-label'>Ordering</div>
          <select name="ordering" id="ordering" value={ordering} onChange={onOrderingChange}>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function TicketGrid({ gridData, grouping, userIdToData }) {
  const keys = useMemo(() => Object.keys(gridData), [gridData]);

  return (
    <div className='grid'>
      {keys.map((k) => <TicketColumn key={k} tickets={gridData[k]} grouping={grouping} groupBy={k} userIdToData={userIdToData} />)}
    </div>
  );
}

function TicketHeader({ grouping, setGrouping, ordering, setOrdering }) {
  return (
    <header>
      <DisplayDropdownMenu grouping={grouping} setGrouping={setGrouping} ordering={ordering} setOrdering={setOrdering} />
    </header>
  );
}

function TicketLoader({ fullscreen = true }) {
  return (
    <div className={`loader-container ${fullscreen && "fullscreen"}`}>
      <span className='loader'>Loading...</span>
    </div>
  );
}

function UserBadge({ name, available }) {
  const text = useMemo(() => {
    return name.split(" ").map((item) => item[0]).join("");
  }, [name]);

  return (
    <div className='user-badge-container'>
      <div className='usericon-text'>{text}</div>
      <div className={`user-status ${available && "available"}`}></div>
    </div>
  );
}

export { TicketCard, TicketColumn, DisplayDropdownMenu, TicketGrid, TicketHeader, TicketLoader, UserBadge };
