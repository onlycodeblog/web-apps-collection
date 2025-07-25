function generateCollatzSequence(defaultNumber) {
    const startingNumber = defaultNumber || parseInt(document.getElementById("startingNumber").value);
    if (isNaN(startingNumber) || startingNumber <= 0) {
        alert("Please enter a positive integer.");
        return;
    }

    let sequence = [];
    let num = startingNumber;

    while (num !== 1) {
        sequence.push(num);
        if (num % 2 === 0) {
            num /= 2;
        } else {
            num = 3 * num + 1;
        }
    }
    sequence.push(1); // Add the last number in the sequence

    // Display sequence
    document.getElementById("sequenceList").innerText = sequence.join(", ");

    // Plot the graph
    plotCollatzGraph(sequence);
}

function plotCollatzGraph(sequence) {
    const ctx = document.getElementById("collatzChart").getContext("2d");

    // Destroy previous chart if it exists
    if (window.collatzChart instanceof Chart) {
        window.collatzChart.destroy();
    }

    // Create the new chart
    window.collatzChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sequence.map((_, index) => index + 1),
            datasets: [{
                label: 'Collatz Sequence',
                data: sequence,
                borderColor: '#5a67d8',
                backgroundColor: 'rgba(90, 103, 216, 0.3)',
                borderWidth: 2,
                pointRadius: 3,
                pointBackgroundColor: '#5a67d8',
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Ensures chart fills container
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Step',
                        color: '#cfcfd4'
                    },
                    ticks: { color: '#cfcfd4' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Value',
                        color: '#cfcfd4'
                    },
                    ticks: { color: '#cfcfd4' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#cfcfd4'
                    }
                }
            }
        }
    });
}
