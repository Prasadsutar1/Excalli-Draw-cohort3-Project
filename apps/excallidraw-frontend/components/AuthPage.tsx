"use client";
export default function AuthPage( {isSignin} : {
    isSignin : boolean
}){
    return(
        <div className="w-screen h-screen flex justify-center items-center">
            <div className="p-6 m-2 bg-white text-black rounded-2xl">
                <div className="p-2">
                <input type="text" placeholder="Email"  />
                </div>
                <div className="p-2">
                <input type="password" placeholder="password" />
                </div>
                <div className="bg-blue-500 rounded-2xl p-2 pt-2">
                <button  onClick={() =>{

                }}>{isSignin ? "sign-in" : "signup"}</button>
                </div>
            </div>

        </div>
    )
}