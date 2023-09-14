import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PieComponent = () => {
    return (
        <div className=''>
            <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                    <Pie
                        data={data}
                        labelLine={false}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div className=' grid grid-cols-4 justify-center mx-auto items-center'>
                {data.map((item) => (
                    <p className='cursor-pointer font-bold'>{item.name}</p>
                ))}
            </div>
            <div className='grid grid-cols-4 justify-center items-center mx-auto '>
                {COLORS.map((item, index) => (
                    <div key={`color-${index}`} className="h-[20px] w-[20px] " style={{ backgroundColor: item }}></div>
                ))}
            </div>
        </div>
    );
}

export default PieComponent;
