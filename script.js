function storeContact(name, phone) {
    localStorage.setItem('contactName', name);
    localStorage.setItem('contactPhone', phone);
}

document.addEventListener("DOMContentLoaded", function() {
    let entreprise = localStorage.getItem('entreprise') || "";
    let nom = localStorage.getItem('nom') || "";
    let contact = localStorage.getItem('contactName') || "[Contact inconnu]";
    document.getElementById('entreprise').value = entreprise;
    document.getElementById('nom').value = nom;
    document.getElementById('sendButton').innerText = `Envoyer votre demande à ${contact}`;
});

function sendSMS() {
    let entreprise = document.getElementById('entreprise').value;
    let nom = document.getElementById('nom').value;
    let contact = localStorage.getItem('contactName');
    let phone = localStorage.getItem('contactPhone');
    localStorage.setItem('entreprise', entreprise);
    localStorage.setItem('nom', nom);
    
    if (entreprise && nom) {
        let message = `Bonjour ${contact}, nous aurions besoin d’un ramassage d’outils chez ${entreprise}.\n\nPourriez-vous me confirmer la réception de ce message et le jour où vous pourrez passer ?\n\nBien cordialement\n${nom}`;
        window.location.href = `sms:${phone}?body=${encodeURIComponent(message)}`;
    } else {
        alert("Veuillez renseigner les deux informations");
    }
}
