<template>
    <div>
        <conversation></conversation>
        <chat_area></chat_area>
    </div>
</template>

<script>
    import conversation from './Conversation'
    import chat_area from './ChatArea'

    export default {
        name: 'chat',
        components: {
            conversation, chat_area
        }
    }
</script>