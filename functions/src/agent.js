const { app } = require('@azure/functions');
// teste
app.http('agent', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            const body = await request.json();

            const response = await fetch(process.env.N8N_URL + 'webhook/184b9ff8-62a9-4896-8595-c8823d6700cc', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-internal-secret': process.env.N8N_SECRET
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();
            return { jsonBody: data };

        } catch (error) {
            context.log('Erro ao chamar n8n:', error);
            return {
                status: 500,
                jsonBody: { error: 'Erro interno ao processar requisição' }
            };
        }
    }
});