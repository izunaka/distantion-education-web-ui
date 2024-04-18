import { makeAutoObservable } from "mobx";
import {  } from 'mobx-persist'

export default class SettingsStore {
    constructor() {
        this._displayAnswers = false;
        this._displayAnalysis = true;
        this._currentMethod = 'tfidf';
        this._useFreequency = false;
        this._useSynonyms = false;
        this._synonymsMaxFine = 0;

        makeAutoObservable(this);
    }

    setDisplayAnswers(value) {
        this._displayAnswers = value;
    }

    get displayAnswers() {
        return this._displayAnswers
    }

    setDisplayAnalysis(value) {
        this._displayAnalysis = value;
    }

    get displayAnalysis() {
        return this._displayAnalysis
    }

    setCurrentMethod(value) {
        this._currentMethod = value;
    }

    get currentMethod() {
        return this._currentMethod
    }

    setUseFreequency(value) {
        this._useFreequency = value;
    }

    get useFreequency() {
        return this._useFreequency
    }

    setUseSynonyms(value) {
        this._useSynonyms = value;
    }

    get useSynonyms() {
        return this._useSynonyms
    }

    setSynonymsMaxFine(value) {
        if (value > 1) {
            this._synonymsMaxFine = 1;
        } else if (value < 0) {
            this._synonymsMaxFine = 0;
        } else {
            this._synonymsMaxFine = value;
        }
        
    }

    get synonymsMaxFine() {
        return this._synonymsMaxFine
    }
}