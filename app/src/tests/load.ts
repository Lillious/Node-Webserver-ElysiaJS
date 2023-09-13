import fetch from "node-fetch";
import { performance } from "node:perf_hooks";

const Payload = {
    URL: `http://localhost/api/v1/user`,
    Attempts: 0,
    Timeout: 0,
    ResponseTime: 0,
    AverageRequestsPerSecond: 0,
    AverageResponseTimeArray: [] as number[],
    AverageResponseTime: -1,
    Stopped: false,
    
    start : async function() {
        setTimeout(async () => {
            if (this.Stopped) {
                this.results(this.AverageResponseTime.toString());
                return;
            }
            try {
                const start = performance.now();
                await fetch(this.URL);
                const end = performance.now();

                this.ResponseTime = Math.round((end - start) * 100) / 100;
                this.AverageRequestsPerSecond = Math.round(1000 / this.ResponseTime);

                if (this.AverageResponseTimeArray.length < 10) {
                    this.AverageResponseTimeArray.push(this.ResponseTime);
                } else {
                    this.AverageResponseTimeArray.shift();
                    this.AverageResponseTimeArray.push(this.ResponseTime);
                }

                if (this.AverageResponseTimeArray.length >= 10) {
                    this.AverageResponseTime = Math.round((this.AverageResponseTimeArray.reduce((a, b) => a + b, 0) / this.AverageResponseTimeArray.length) * 1000) / 1000;
                }

                this.Attempts++;
                this.start();
            }
            catch (error: any) {
                throw new Error(error);
            }
        }, this.Timeout);
    },
    stop: function() {
        this.Stopped = true;
    },
    results: function(_AverageResponseTime: string) {
        if (this.Stopped) {
            console.clear();
            console.log('| Traffic Load Test Results |');
            console.log(`Attempts: ${this.Attempts} | URL: ${this.URL} | Average Response Time: ${_AverageResponseTime}ms | Average Requests Per Second: ${this.AverageRequestsPerSecond}`);
        }
    }
};

Payload.start();

const time = 10;
for (let i = 0; i < time; i++) {
    setTimeout(() => {
        console.clear();
        console.log(`Running Traffic Load Test (${time - i}s) ... Please wait`);
    }, i * 1000);
}

setTimeout(() => {
    Payload.stop();
}, time * 1000);