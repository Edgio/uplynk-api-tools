//   MSS CODE   // -->
window.addEventListener('load', function() {
    const cl = console.log;
    
    async function myFunction() {

        const secret = new TextEncoder().encode('KnrrSgM/JGDcGwV7PnCHg1+RxJOU9soLT6iYpUjf');
        const hashBuffer = await crypto.subtle.digest('SHA-1', secret);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hexHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        const timestamp = Math.floor(Date.now() / 1000);
        const endpoint = '/status';
        const cnonce = 123;
        const sigInput = `${endpoint}:${timestamp}:${cnonce}:${hexHash}`;
            // IF UTF8 IS A PROBLEM //
                // const sigInputUtf8 = new TextEncoder().encode(sigInput);
                // const sigHash = await crypto.subtle.digest('SHA-1', sigInputUtf8);
            //                      //
        const sigHash = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(sigInput));
        const sig = btoa(String.fromCharCode(...new Uint8Array(sigHash)));

        const body = JSON.stringify({ timestamp, cnonce, sig });
        try {
            const response = await fetch('https://ingest-prod-1-eu-central-1.mss.aws.oath.cloud:48438' + endpoint, {
                method: 'POST',
                body
            });
            const jsonRes = await response.json();
            console.log(JSON.stringify(jsonRes, null, 4));
            if (jsonRes.error !== 0) throw new Error('Error in response');
        } catch (err) {
            console.error(err);
        }
     
    }
    cl('the page is live')
    // myFunction();
})