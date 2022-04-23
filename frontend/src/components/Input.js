import React from 'react'
import { ErrorMessage, Field } from 'formik'

export default function Input(props1) {
    return (
        <div className="flex flex-col">
            <label className={`mt-3 ${props1.labelcolor}`} htmlFor={props1.name}><h4>{props1.label}</h4></label>
            <Field as={props1.as} name={props1.name} >
                {
                    (props2) => {
                        const { field, form, meta } = props2
                        return (
                            
                            <input id={props2.id} {...field} placeholder={props1.placeholder} className={`border-2 focus:ring-4 focus:ring-opacity-50 focus:${props1.ringcolor} focus:transition-all outline-none focus:ring-black focus:fade-in-out ${props1.className} rounded-md  p-1`} type={props1.type} />
                            
                        )
                    }
                }
            </Field>
            <div id="error" className="text-red-500">
                
                <ErrorMessage name={props1.name} />
            </div>
        </div>
    )
}
