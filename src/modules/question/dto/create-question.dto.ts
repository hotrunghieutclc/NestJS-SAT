<<<<<<< HEAD
import { ArrayNotRequired, BooleanNotRequired, NumberNotRequired, NumberRequired, ObjectNotRequired, StringNotRequired, StringRequired } from "src/common/decorators";

export class QuestionChoiceDto {
    @StringRequired('Nội dung câu trả lời')
    choiceText: string;

    @NumberRequired('Thứ tự câu trả lời')
    choiceOrder: number;

    @BooleanNotRequired()
    isCorrect: boolean;
}

export class IRLParameterDto {
    @NumberRequired('Chỉ số a')
    a: number;

    @NumberRequired('Chỉ số b')
    b: number;

    @NumberNotRequired('Chỉ số c')
    c?: number
}

=======
import { NumberNotRequired, StringNotRequired, StringRequired } from "src/common/decorators";
>>>>>>> 2381e81f24a0c2faf66ca0175b91224ffc314060

export class CreateQuestionDto {
    @StringRequired('Nội dung câu hỏi')
    content: string;

<<<<<<< HEAD
    @NumberNotRequired("Mã")
    hashId?: number;

    @StringRequired("Phạm vi")
    section: string;

    @StringRequired("Kỹ năng")
    skill: string;
=======
    @StringNotRequired()
    section?: string;

    @StringNotRequired()
    skill?: string;
>>>>>>> 2381e81f24a0c2faf66ca0175b91224ffc314060

    @StringNotRequired()
    passage?: string;

<<<<<<< HEAD
    @StringRequired("Độ khó")
    difficulty: string;
=======
    @StringNotRequired()
    difficulty?: string;
>>>>>>> 2381e81f24a0c2faf66ca0175b91224ffc314060

    @StringNotRequired()
    model?: string;

<<<<<<< HEAD
    @ArrayNotRequired(QuestionChoiceDto)
    questionChoices?: QuestionChoiceDto[];

    @ObjectNotRequired(IRLParameterDto)
    irlParameter?: IRLParameterDto
}
=======
    @NumberNotRequired('Hash ID')
    hashId?: number;
}
>>>>>>> 2381e81f24a0c2faf66ca0175b91224ffc314060
