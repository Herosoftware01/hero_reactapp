'use client';

import { useEffect, useState } from 'react';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { CheckBoxComponent, ButtonComponent } from '@syncfusion/ej2-react-buttons';

export default function Login() {

    useEffect(() => {

    }, []);

    
    return (
        <section className="bg-gray-50 dark:bg-gray-950">
            <div className="flex items-center justify-center md:min-h-screen">
                <div className="w-full max-w-md rounded-lg px-4 py-14 md:px-6 md:py-20">
                    <div className="flex justify-center mb-6">
                        <img className="mr-2" src="/react/essential-ui-kit/blocks/assets/images/common/brand-logos/svg/vector.svg" width={32} height={32} alt="company logo" />
                        <h2 className="text-center text-gray-900 dark:text-white text-xl font-semibold">Company Name</h2>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center mb-2">Sign in</h2>
                    <p className="text-md text-center text-gray-700 dark:text-gray-300">Enter your credentials to sign in</p>
                    <form action="#" className="mt-6 mb-6" onSubmit={(event) => event.preventDefault()}>
                        <div className="mb-4">
                            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                            <TextBoxComponent cssClass="e-bigger" type="email" placeholder="Email" floatLabelType="Never"></TextBoxComponent>
                        </div>
                        <div className="mb-5 relative">
                            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                            <TextBoxComponent cssClass="e-bigger" type="password" placeholder="Password" floatLabelType="Never"></TextBoxComponent>
                        </div>
                        <div className="flex items-center justify-between mb-6">
                            <CheckBoxComponent cssClass="e-bigger" label="Remember me"></CheckBoxComponent>
                            <a href="#" className="text-primary-600 dark:text-primary-400 font-medium text-base" style={{ paddingRight: 0 }}>Forgot password?</a>
                        </div>
                        <div className="e-bigger mt-6">
                            <ButtonComponent className="w-full e-primary" content="Sign in" type="submit" onClick={(event) => event.preventDefault()}></ButtonComponent>
                        </div>
                    </form>
                    <div>
                        <span className="flex items-center justify-center gap-2">
                            <p className="text-center text-base text-gray-900 dark:text-white">Don't have an account yet?</p>
                            <a href="#" className="text-primary-600 dark:text-primary-400 font-medium text-base p-0">Sign up</a>
                        </span>
                        <div className="relative flex justify-center items-center mt-10">
                            <span className="bg-gray-50 dark:bg-gray-950 px-2 z-10 absolute text-sm text-gray-700 dark:text-gray-300">Or continue with</span>
                            <hr className="w-full absolute border-gray-200 dark:border-gray-600" />
                        </div>
                        <div className="flex items-center justify-center pt-10 gap-4 flex-col">
                            <ButtonComponent className="w-full flex items-center justify-center px-4 py-2 e-outline" type="submit">
                                <img src="/react/essential-ui-kit/blocks/assets/images/common/brand-logos/png/google.png" width={16} height={16} alt="google image" />
                                <span className="text-base pl-2.5">Sign in with Google</span>
                            </ButtonComponent>
                            <ButtonComponent className="w-full flex items-center justify-center px-4 py-2 e-outline" type="submit">
                                <img src="/react/essential-ui-kit/blocks/assets/images/common/brand-logos/png/microsoft.png" width={16} height={16} alt="microsoft image" />
                                <span className="text-base pl-2.5">Sign in with Microsoft</span>
                            </ButtonComponent>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}