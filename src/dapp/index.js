import DOM from './dom';
import Contract from './contract';
import './realEstate.css';

(async() => {
    let contract = new Contract( () =>{
        contract.addEventsListener(displayEvents);
        
        DOM.elid('mint-token').addEventListener('click', () => {
            let tokenId = DOM.elid('token-id').value;
            contract.mintToken(tokenId, (error, result) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log('token minted');
                    console.log(result);
                }
            });
        });

    });
})();
function displayEvents(data){
    let eventsDiv = DOM.elid('txt-events');
    let line = DOM.line({}, String(data));
    eventsDiv.append(line);
    console.log(typeof(eventsDiv));
}