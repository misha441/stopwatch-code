import './App.css';
import {interval} from 'rxjs';
import {useEffect, useMemo, useState} from "react";


function App() {
    const [time, setTime] = useState(new Date(0))
    const [observable$, setObservable] = useState(null)
    const [isDoubleClick, setIsDoubleClick] = useState(false)

    const RxInterval = useMemo(() => interval(100), [])

    const doubleClickTimer = useMemo(() => {
        if (isDoubleClick) {
            return setTimeout(() => setIsDoubleClick(false), 300)
        }
    }, [isDoubleClick])

    useEffect(() => {
        if (!isDoubleClick) {
            clearTimeout(doubleClickTimer)
        }
    }, [isDoubleClick])

    const startStopwatch = () => {
        if (observable$) {
            observable$.unsubscribe()
            setObservable(null)
            setTime(new Date(0))
        } else {
            const startSubscribe = RxInterval.subscribe(val => {
                setTime(new Date(Date.parse(new Date(val * 100)) + Date.parse(time)))
            })
            setObservable(startSubscribe)
        }
    }

    const waitStopwatch = () => {
        if (isDoubleClick) {
            setIsDoubleClick(false)
            if (observable$) {
                observable$.unsubscribe()
                setObservable(null)
            }
        } else {
            setIsDoubleClick(true)
        }

    }

    const resetStopwatch = () => {
        if (observable$) {
            observable$.unsubscribe()
        }
        setObservable(null)
        setTime(new Date(0))
        const startSubscribe = RxInterval.subscribe(val => {
            setTime(new Date(Date.parse(new Date(val * 100)) + Date.parse(new Date(0))))
        })
        setObservable(startSubscribe)
    }

    return (
        <div className="App">
            <div className="stopwatch">
                {
                    ('0' + time.getUTCHours()).slice(-2) + ':' +
                    ('0' + time.getUTCMinutes()).slice(-2) + ':' +
                    ('0' + time.getUTCSeconds()).slice(-2)
                }
            </div>
            <div className="buttons">
                <button onClick={startStopwatch} className={`start-stop 
                                                 ${observable$ ? 'stop-btn' : 'start-btn'}`}>
                    {observable$ ? 'Stop' : 'Start'}
                </button>
                <button onClick={waitStopwatch} className="wait">Wait</button>
                <button onClick={resetStopwatch} className="reset">Reset</button>
            </div>
        </div>
    );
}

export default App;
