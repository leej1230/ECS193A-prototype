import React, { useState } from 'react';

const Management = () => {
    const [data, setData] = useState([
        { name: 'John Doe', is_admin: true, is_member: false },
        { name: 'Jane Smith', is_admin: false, is_member: true },
    ]);

    const handleCheckboxChange = (index, key) => {
        setData((prevData) => {
            const newData = [...prevData];
            newData[index] = {
                ...newData[index],
                [key]: !newData[index][key]
            };
            return newData;
        });
    };

    const handleSave = () => {
        console.log('Updated data:', data);
    };

    return (
        <div className="container my-3">
            <h2 className='text-center my-3'>Manage Users</h2>
            <table className="table table-bordered table-striped">
                <thead className="thead-dark">
                    <tr>
                        <th>Full Name</th>
                        <th>Admin</th>
                        <th>Member</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.name}</td>
                            <td>
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={item.is_admin}
                                    onChange={() => handleCheckboxChange(index, 'is_admin')}
                                />
                            </td>
                            <td>
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={item.is_member}
                                    onChange={() => handleCheckboxChange(index, 'is_member')}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="btn btn-primary" onClick={handleSave}>Save</button>
        </div>
    );
};

export default Management;
