import React, { useState } from 'react';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonPage, useIonViewWillEnter, useIonViewDidLeave } from '@ionic/react';

import { ActionCard } from '../components';
import { Auth } from '../services/AuthService';
import { AuthActions, AuthActionBuilder, AuthObserver } from 'ionic-appauth';
import { RouteComponentProps } from 'react-router';

interface LandingPageProps extends RouteComponentProps {}

const IDP = process.env.REACT_APP_AUTH_EXTRA_IDP;

const Landing : React.FC<LandingPageProps> = (props: LandingPageProps) => {

    const [action, setAction] = useState(AuthActionBuilder.Default);
    
    let observer: AuthObserver;

    useIonViewWillEnter(() => {
        Auth.Instance.loadTokenFromStorage();
        observer = Auth.Instance.addActionListener((action) => {
            setAction(action)
            if(action.action === AuthActions.SignInSuccess || 
                action.action === AuthActions.LoadTokenFromStorageSuccess){
              props.history.replace('home');
            }
        });
    });

    useIonViewDidLeave(() => {
        Auth.Instance.removeActionObserver(observer);
    });
 
    function handleSignIn(e : any) {
        e.preventDefault();

        let authExtra = IDP ? { idp: IDP } : undefined;
        Auth.Instance.signIn(authExtra);
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Ionic AppAuth React Demo (Logged Out)</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonButton onClick={handleSignIn}>Sign In</IonButton>
                <ActionCard action={action}></ActionCard>
            </IonContent>
        </IonPage>
    ); 
};

export default Landing;
