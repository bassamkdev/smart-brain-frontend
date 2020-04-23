import React from 'react';

const Rank = ({name, entries}) => {
	const [emoji, setEmoji] = React.useState('');

	const generateEmoji = (entries) => {
		fetch(`https://nhtx1a78uc.execute-api.us-east-1.amazonaws.com/prod/rank?rank=${entries}`)
			.then(resp => resp.json())
			.then(data => setEmoji(data.input))
			.catch(console.log)
	}
	
	React.useEffect(() => {
		generateEmoji(entries)
	}, [entries])

	return (
		<div>
			<div className='white f3'>
				{`${name}, your entries count is ...`}
			</div>
			<div className='white f1'>
				{entries}
			</div>
			<div className='white f3'>
				{`Rank Badge: ${emoji}`}
			</div>
		</div>
	)
}

export default Rank;