import React from 'react';

const Error = () => {
    return (
        <div className="flex flex-nowrap items-center">
            <div className="text-4xl font-bold">:(</div>
            <div className="pl-4 text-2xl">404 Error - This routing does not exist</div>
        </div>
    );
}

export default Error;