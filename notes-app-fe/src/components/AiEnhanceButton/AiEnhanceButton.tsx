import { useState } from 'react';
import axiosInstance from '../../axios/axios.instance';
import { Button, Spinner } from '@chakra-ui/react';
import { useColorModeValue } from '../ui/color-mode';
import { useToast } from '@chakra-ui/toast';

const AiEnhanceButton: React.FC<{ content: string }> = ({
	content,
	setEnhancedContent,
	setShowEnhanced,
}) => {
	const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
	const toast = useToast();

	const handleEnhance = async () => {
		setIsEnhancing(true);

		try {
			const response = await axiosInstance.post(
				`${process.env.REACT_APP_BE_URL}/notes/enhance`,
				{
					content,
				},
			);

			if (response.status === 201) {
				console.log(response.data.enhancedContent);

				const enhancedText = response.data.enhancedContent;
				setEnhancedContent(enhancedText);
				setShowEnhanced(true);
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to enhance the note. Please try again.',
				status: 'error',
				duration: 2000,
				isClosable: true,
			});
		} finally {
			setIsEnhancing(false);
		}
	};

	return (
		<Button
			variant='ghost'
			colorScheme='teal'
			bg={useColorModeValue('teal.50', 'teal.900')}
			onClick={handleEnhance}
			disabled={isEnhancing || content === ''}
		>
			{isEnhancing ? <Spinner size='sm' mr={2} /> : null}
			AI Enhance
		</Button>
	);
};

export default AiEnhanceButton;
