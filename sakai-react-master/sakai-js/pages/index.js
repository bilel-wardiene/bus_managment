import getConfig from 'next/config';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import AppConfig from '../layout/AppConfig';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../layout/context/layoutcontext'; 
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import axios from 'axios';

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post("http://localhost:5000/user/signin", { email, password });
            const token = response.data.data;
            // Save the token in local storage (or wherever you want to store it)
            localStorage.setItem("token", token);
            // Redirect user to home page (or wherever you want)
            router.push('/pages/dashboard/');
        } catch (error) {
            setError(error.response.data.msg || error.message);
        }
    };
    
  
     const [checked, setChecked] = useState(false);
     const { layoutConfig } = useContext(LayoutContext);
     const contextPath = getConfig().publicRuntimeConfig.contextPath;
     const router = useRouter();
     const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', {'p-input-filled': layoutConfig.inputStyle === 'filled'});

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
               
                <form onSubmit={handleSubmit}>
                <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <img src={`${contextPath}/demo/images/login/bus.jpg`} alt="Image" height="40" style={{borderRadius: '53px'}} className="mb-3" />
                            <div className="text-900 text-3xl font-medium mb-3">Welcome</div>
                            <span className="text-600 font-medium">Sign in to continue</span>
                        </div>

                        <div>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Email
                            </label>
                            <InputText inputid="email1" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                             type="email" placeholder="Email address" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />
                
                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                Password
                            </label>
                            <Password inputid="password1" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                             placeholder="Password"
                              toggleMask className="w-full mb-5" inputClassName='w-full p-3 md:w-30rem'></Password>

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    <Checkbox inputid="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked)} className="mr-2"></Checkbox>
                                    <label htmlFor="rememberme1">
                                        Remember me
                                    </label>
                                </div>
                                <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                    Forgot password?
                                </a>
                            </div>
                           
                            <Button label="Sign In" className="w-full p-3 text-xl" type="submit"></Button>
                            {error && <p>{error}</p>}
                        </div>
                    </div>
                </div>
                </form>
            </div>
        </div>
    );
};

LoginPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};
export default LoginPage;