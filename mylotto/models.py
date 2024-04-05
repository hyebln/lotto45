from django.db import models


class LottoList(models.Model):
    lottogroup = models.CharField(db_column='LOTTOGROUP', max_length=255, blank=True)  # Field name made lowercase.
    odd_cnt = models.IntegerField(db_column='ODD_CNT', blank=True, null=True)  # Field name made lowercase.
    small_cnt = models.IntegerField(db_column='SMALL_CNT', blank=True, null=True)  # Field name made lowercase.
    prime_cnt = models.IntegerField(db_column='PRIME_CNT', blank=True, null=True)  # Field name made lowercase.
    consq_cnt = models.IntegerField(db_column='CONSQ_CNT', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'lotto_table'

class LottoResult(models.Model):
    round = models.IntegerField(db_column="round", blank=True)  # Field name made lowercase.
    num1 = models.IntegerField(db_column="num1", blank=True, null=True)  # Field name made lowercase.
    num2 = models.IntegerField(db_column="num2", blank=True, null=True)  # Field name made lowercase.
    num3 = models.IntegerField(db_column="num3", blank=True, null=True)  # Field name made lowercase.
    num4 = models.IntegerField(db_column="num4", blank=True, null=True)  # Field name made lowercase.
    num5 = models.IntegerField(db_column="num5", blank=True, null=True)  # Field name made lowercase.
    num6 = models.IntegerField(db_column="num6", blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = "lotto_result"
