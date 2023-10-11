from djoser import email


class BaseEmail(email.BaseEmailMessage):
    def get_context_data(self):
        context = super().get_context_data()
        context["site_name"] = "UWAM FRACAS"
        context["domain"] = "localhost:3000"
        context["image_url"] = "static/images/UWAM-Logo-2023-(colour).png"
        context["backend"] = "127.0.0.1:8000"
        return context


class ActivationEmail(BaseEmail, email.ActivationEmail):
    template_name = "email/activation.html"


class ConfirmationEmail(BaseEmail, email.ConfirmationEmail):
    template_name = "email/confirmation.html"


class PasswordResetEmail(BaseEmail, email.PasswordResetEmail):
    template_name = "email/password_reset.html"


class PasswordChangedConfirmationEmail(
    BaseEmail, email.PasswordChangedConfirmationEmail
):
    template_name = "email/password_changed_confirmation.html"


# from djoser import email


# class ActivationEmail(email.ActivationEmail):
#     template_name = "email/activation.html"

#     def get_context_data(self):
#         context = super().get_context_data()
#         context["site_name"] = "UWAM FRACAS"
#         context["domain"] = "localhost:3000"
#         context["image_url"] = "static/images/UWAM-Logo-2023-(colour).png"
#         return context


# class ConfirmationEmail(email.ConfirmationEmail):
#     template_name = "email/confirmation.html"

#     def get_context_data(self):
#         context = super().get_context_data()
#         context["site_name"] = "UWAM FRACAS"
#         context["domain"] = "localhost:3000"
#         context["image_url"] = "static/images/UWAM-Logo-2023-(colour).png"
#         return context


# class PasswordResetEmail(email.PasswordResetEmail):
#     template_name = "email/password_reset.html"

#     def get_context_data(self):
#         context = super().get_context_data()
#         context["site_name"] = "UWAM FRACAS"
#         context["domain"] = "localhost:3000"
#         context["image_url"] = "static/images/UWAM-Logo-2023-(colour).png"
#         return context


# class PasswordChangedConfirmationEmail(email.PasswordChangedConfirmationEmail):
#     template_name = "email/password_changed_confirmation.html"

#     def get_context_data(self):
#         context = super().get_context_data()
#         context["site_name"] = "UWAM FRACAS"
#         context["domain"] = "localhost:3000"
#         context["image_url"] = "static/images/UWAM-Logo-2023-(colour).png"
#         return context
