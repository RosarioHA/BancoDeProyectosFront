import React from 'react';

const NotificationModal = ({ show, dataNotifications, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        <h2>Notificaciones</h2>
        {/* Aquí renderizas tus dataNotifications */}
        {dataNotifications.map((notification, index) => (
            <li key={index} className="list-group-item"
            style={{ backgroundColor: notification.read ? 'transparent' : 'darkgray' }}>
                <div className="d-flex mb-1">
                  <div className="text-start text-sans-b-gray">{`${notification.action}`}</div>
                  <div className="ms-auto text-sans-c-gray">{notification.history_date}</div>
                </div>
                <div className="text-sans-p">{notification.project_name}</div>
            </li>
            
        ))}
      </div>
    </div>
  );
};

export default NotificationModal;
