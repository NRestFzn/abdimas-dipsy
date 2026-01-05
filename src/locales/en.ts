export default {
  common: {
    success: 'Operation successful',
    error: 'Something went wrong',
  },

  success: {
    created: 'Data created successfully',
    retrieved: 'Data retrieved successfully',
    updated: 'Data updated successfully',
    deleted: 'Data deleted successfully',
    restored: 'Data restored successfully',
  },

  errors: {
    badRequest: 'Bad request',
    forbidden: 'You do not have permission to access this resource',
    internalServer: 'Internal server error',
    notFound: 'Data not found',
    unauthorized: 'Unauthorized access',
  },

  auth: {
    loginFailed: 'Invalid email or password',
    loginNikFailed: 'Invalid nik or password',
    emailUsed: 'Email is already registered',
    nikUsed: 'NIK is already registered',
    phoneUsed: 'Phone number is already registered',
    loginSuccess: 'Login successfully',
    registerSuccess: 'User registered successfully',
  },

  user: {
    notFound: 'User not found',
    profileUpdated: 'Profile updated successfully',
    profilePictureUpdated: 'Profile picture updated successfully',
    inCompleteDetail: 'User has not filled complete data',
  },

  questionnaire: {
    duplicateOrder: 'Duplicate order found',
    inCompleteAnswer: 'Please answer all available questions',
    exceededAnswer: 'Submitted answers exceed the available questions',
    notFound: 'QUestionnaire not found',
    questionNotFound: 'Question with id {id} not found',
    noQuestion: "Questionnaire doesn't have question yet",
  },
}
